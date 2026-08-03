<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $ulid
 * @property string|null $nik
 * @property string|null $nik_hash
 * @property string $name
 * @property string $email
 * @property UserRole $role
 * @property bool $is_active
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property int $failed_login_attempts
 * @property Carbon|null $locked_until
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $last_login_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'nik', 'role', 'is_active', 'failed_login_attempts', 'locked_until', 'last_login_at'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasUlids, Notifiable, TwoFactorAuthenticatable;

    protected static function booted(): void
    {
        static::saving(function (User $user) {
            if ($user->isDirty('nik')) {
                $user->nik_hash = $user->nik ? hash('sha256', $user->nik) : null;
            }
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'role' => UserRole::class,
            'is_active' => 'boolean',
            'failed_login_attempts' => 'integer',
            'locked_until' => 'datetime',
            'nik' => 'encrypted',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Get the verification tokens for the user.
     *
     * @return HasMany<VerificationToken, $this>
     */
    public function verificationTokens(): HasMany
    {
        return $this->hasMany(VerificationToken::class);
    }

    /**
     * Check if the user has administrator role.
     */
    public function isAdministrator(): bool
    {
        return $this->role === UserRole::Administrator;
    }

    /**
     * Check if the user has kader role.
     */
    public function isKader(): bool
    {
        return $this->role === UserRole::Kader;
    }

    /**
     * Check if the user account is locked.
     */
    public function isLocked(): bool
    {
        return $this->locked_until !== null && $this->locked_until->isFuture();
    }

    /**
     * Get the columns that should receive a unique identifier.
     *
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return ['ulid'];
    }

    /** Gunakan kolom ulid sebagai route key binding selain primary key id. */
    public function getRouteKeyName(): string
    {
        return 'ulid';
    }

    /** Cek apakah profil kader sudah lengkap (nama, email, dan NIK terisi). */
    public function isProfileComplete(): bool
    {
        return ! empty($this->name)
            && ! empty($this->email)
            && ! empty($this->nik);
    }

    /**
     * Scope query to filter users with complete profile.
     *
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    public function scopeWithCompleteProfile(Builder $query): Builder
    {
        return $query->whereNotNull('name')->where('name', '!=', '')
            ->whereNotNull('email')->where('email', '!=', '')
            ->whereNotNull('nik')->where('nik', '!=', '');
    }

    public function issueVerificationToken(): string
    {
        $rawToken = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $this->verificationTokens()->create([
            'token_hash' => VerificationToken::hash($rawToken),
            'expires_at' => now()->addMinutes(30),
        ]);

        return $rawToken;
    }
}
