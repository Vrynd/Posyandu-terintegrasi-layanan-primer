<?php

namespace App\Models;

use App\Enums\ScheduleStatus;
use Database\Factories\ScheduleFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $ulid
 * @property int|null $user_id
 * @property string $title
 * @property string|null $activity_type
 * @property Carbon $date
 * @property string|null $start_time
 * @property string|null $end_time
 * @property string $location
 * @property string|null $description
 * @property ScheduleStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $creator
 */
class Schedule extends Model
{
    /** @use HasFactory<ScheduleFactory> */
    use HasFactory, HasUlids;

    protected $table = 'activity_schedules';

    protected $fillable = [
        'user_id',
        'title',
        'activity_type',
        'date',
        'start_time',
        'end_time',
        'location',
        'description',
        'status',
    ];

    protected $appends = [
        'effective_status',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'status' => ScheduleStatus::class,
        ];
    }

    /**
     * Kolom yang menerima ULID unik.
     *
     * @return list<string>
     */
    public function uniqueIds(): array
    {
        return ['ulid'];
    }

    public function getRouteKeyName(): string
    {
        return 'ulid';
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }

    /**
     * Scope untuk pencarian berdasarkan judul, jenis kegiatan, atau lokasi.
     *
     * @param  Builder<Schedule>  $query
     * @return Builder<Schedule>
     */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
                ->orWhere('activity_type', 'like', "%{$term}%")
                ->orWhere('location', 'like', "%{$term}%")
                ->orWhere('description', 'like', "%{$term}%");
        });
    }

    /**
     * Scope untuk filter berdasarkan status jadwal.
     *
     * @param  Builder<Schedule>  $query
     * @return Builder<Schedule>
     */
    public function scopeOfStatus(Builder $query, ScheduleStatus|string|null $status): Builder
    {
        if (blank($status) || $status === 'all') {
            return $query;
        }
        $value = $status instanceof ScheduleStatus ? $status->value : $status;

        return $query->where('status', $value);
    }

    /**
     * Scope untuk filter berdasarkan bulan dan tahun.
     *
     * @param  Builder<Schedule>  $query
     * @return Builder<Schedule>
     */
    /**
     * Scope untuk filter berdasarkan bulan tertentu (1-12).
     *
     * @param  Builder<Schedule>  $query
     * @return Builder<Schedule>
     */
    public function scopeInMonth(Builder $query, ?int $month): Builder
    {
        if (! $month || $month < 1 || $month > 12) {
            return $query;
        }

        return $query->whereMonth('date', $month);
    }

    /**
     * Scope untuk filter berdasarkan tahun tertentu.
     *
     * @param  Builder<Schedule>  $query
     * @return Builder<Schedule>
     */
    public function scopeInYear(Builder $query, ?int $year): Builder
    {
        if (! $year) {
            return $query;
        }

        return $query->whereYear('date', $year);
    }

    /**
     * Scope untuk pengurutan data jadwal kegiatan.
     *
     * @param  Builder<Schedule>  $query
     * @return Builder<Schedule>
     */
    public function scopeSorted(Builder $query, ?string $sort): Builder
    {
        return match ($sort) {
            'oldest' => $query->oldest('date'),
            'title_asc' => $query->orderBy('title', 'asc'),
            'title_desc' => $query->orderBy('title', 'desc'),
            default => $query->latest('date'),
        };
    }

    /**
     * Otomatis menyinkronkan jadwal yang sudah lewat tanggalnya menjadi 'completed'.
     */
    public static function syncScheduleStatuses(): void
    {
        static::query()
            ->where('date', '<', Carbon::today()->toDateString())
            ->whereIn('status', [
                ScheduleStatus::Scheduled->value,
                ScheduleStatus::Ongoing->value,
            ])
            ->update([
                'status' => ScheduleStatus::Completed->value,
            ]);
    }

    /**
     * Menghitung status 'ongoing' dan 'completed' secara otomatis berdasarkan
     * tanggal dan rentang jam kegiatan tanpa memerlukan cron job per-menit.
     *
     * @return Attribute<ScheduleStatus, never>
     */
    protected function effectiveStatus(): Attribute
    {
        return Attribute::get(function (): ScheduleStatus {
            if (in_array($this->status, [ScheduleStatus::Cancelled, ScheduleStatus::Completed], true)) {
                return $this->status;
            }

            $isToday = $this->date->isToday();
            $now = Carbon::now();
            $startTime = $this->start_time ? Carbon::parse($this->start_time) : null;
            $endTime = $this->end_time ? Carbon::parse($this->end_time) : null;

            return match (true) {
                $this->date->isPast() && ! $isToday => ScheduleStatus::Completed,
                $isToday && $endTime && $now->greaterThanOrEqualTo($endTime) => ScheduleStatus::Completed,
                $isToday && $startTime && $now->greaterThanOrEqualTo($startTime) => ScheduleStatus::Ongoing,
                $isToday && ! $startTime && ! $endTime => ScheduleStatus::Ongoing,
                default => $this->status,
            };
        });
    }
}
