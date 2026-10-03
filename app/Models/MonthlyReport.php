<?php

namespace App\Models;

use App\Enums\ReportStatus;
use App\Enums\ReportType;
use Database\Factories\MonthlyReportFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $ulid
 * @property int $year
 * @property int $month
 * @property ReportType $report_type
 * @property ReportStatus $status
 * @property Carbon|null $finalized_at
 * @property int|null $finalized_by
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $finalizer
 */
class MonthlyReport extends Model
{
    /** @use HasFactory<MonthlyReportFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'year',
        'month',
        'report_type',
        'status',
        'finalized_at',
        'finalized_by',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'month' => 'integer',
            'report_type' => ReportType::class,
            'status' => ReportStatus::class,
            'finalized_at' => 'datetime',
        ];
    }

    /**
     * Get the columns that should receive a unique identifier.
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
     * Relasi ke kader yang memfinalisasi laporan.
     *
     * @return BelongsTo<User, $this>
     */
    public function finalizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'finalized_by');
    }

    /**
     * Cek apakah laporan jenis ini pada periode ini sudah berstatus selesai/final.
     */
    public function isFinalized(): bool
    {
        return $this->status === ReportStatus::Completed;
    }
}
