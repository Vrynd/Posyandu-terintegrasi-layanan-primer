<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $token_hash
 * @property bool $is_used
 * @property Carbon|null $used_at
 * @property Carbon $expires_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property User $user
 */
class VerificationToken extends Model
{
    protected $fillable = [
        'user_id',
        'token_hash',
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
     * Get the user that owns the verification token.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Compute SHA-256 hash for a given 6-digit token.
     */
    public static function hash(string $token): string
    {
        return hash('sha256', trim($token));
    }

    /**
     * Determine if the token is still valid (not used and not expired).
     */
    public function isValid(): bool
    {
        return ! $this->is_used && $this->expires_at->isFuture();
    }

    /**
     * Mark the token as used and verify the owning user's email.
     */
    public function markAsUsed(): void
    {
        $this->update([
            'is_used' => true,
            'used_at' => now(),
        ]);

        $this->user->forceFill(['email_verified_at' => now()])->save();
    }
}
