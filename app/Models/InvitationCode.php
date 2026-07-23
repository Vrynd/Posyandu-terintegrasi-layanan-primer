<?php

namespace App\Models;

use Database\Factories\InvitationCodeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $code_hash
 * @property bool $is_used
 * @property Carbon|null $used_at
 * @property Carbon $expires_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property User|null $user
 */
class InvitationCode extends Model
{
    /** @use HasFactory<InvitationCodeFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'code_hash',
        'is_used',
        'used_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'is_used' => 'boolean',
            'used_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Get the cadre user associated with the invitation code.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Compute SHA-256 hash for a given 16-character invitation code.
     */
    public static function hash(string $code): string
    {
        return hash('sha256', trim($code));
    }

    /**
     * Determine if the invitation code is still valid (not used and not expired).
     */
    public function isValid(): bool
    {
        return ! $this->is_used && $this->expires_at->isFuture();
    }

    /**
     * Mark the invitation code as used.
     */
    public function markAsUsed(): void
    {
        $this->update([
            'is_used' => true,
            'used_at' => now(),
        ]);
    }
}
