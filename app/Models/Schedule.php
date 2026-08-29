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
 * @property Carbon $start_date
 * @property Carbon $end_date
 * @property string|null $start_time
 * @property string|null $end_time
 * @property string $location
 * @property ScheduleStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $creator
 * @property-read ScheduleStatus $effective_status
 */
class Schedule extends Model
{
    /** @use HasFactory<ScheduleFactory> */
    use HasFactory, HasUlids;

    protected $table = 'activity_schedules';

    protected $fillable = [
        'user_id',
        'title',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'location',
        'status',
    ];

    protected $appends = [
        'effective_status',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
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

        return $query->where(function (Builder $q) use ($month) {
            $q->whereMonth('start_date', $month)
                ->orWhereMonth('end_date', $month);
        });
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

        return $query->where(function (Builder $q) use ($year) {
            $q->whereYear('start_date', $year)
                ->orWhereYear('end_date', $year);
        });
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
            'oldest' => $query->oldest('start_date'),
            'title_asc' => $query->orderBy('title', 'asc'),
            'title_desc' => $query->orderBy('title', 'desc'),
            default => $query->latest('start_date'),
        };
    }

    /**
     * Otomatis menyinkronkan jadwal yang sudah lewat tanggalnya menjadi 'completed'.
     */
    public static function syncScheduleStatuses(): void
    {
        static::query()
            ->where('end_date', '<', Carbon::today()->toDateString())
            ->whereIn('status', [ScheduleStatus::Scheduled->value, ScheduleStatus::Ongoing->value])
            ->update(['status' => ScheduleStatus::Completed->value]);
    }

    /**
     * Menghitung status 'ongoing' dan 'completed' secara otomatis
     *
     * @return Attribute<ScheduleStatus, never>
     */
    protected function effectiveStatus(): Attribute
    {
        return Attribute::get(function (): ScheduleStatus {
            if (in_array($this->status, [ScheduleStatus::Cancelled, ScheduleStatus::Completed], true)) {
                return $this->status;
            }

            $today = Carbon::today();
            $now = Carbon::now();
            $isFirstDay = $this->start_date->isToday();
            $isLastDay = $this->end_date->isToday();
            $isWithinRange = $today->betweenIncluded($this->start_date, $this->end_date);

            $startTime = $this->start_time ? Carbon::parse($this->start_time) : null;
            $endTime = $this->end_time ? Carbon::parse($this->end_time) : null;

            return match (true) {
                $this->end_date->isPast() && ! $isLastDay => ScheduleStatus::Completed,
                $isLastDay && $endTime && $now->greaterThanOrEqualTo($endTime) => ScheduleStatus::Completed,
                $isFirstDay && $startTime && $now->lessThan($startTime) => ScheduleStatus::Scheduled,
                $isWithinRange => ScheduleStatus::Ongoing,

                default => $this->status,
            };
        });
    }
}
