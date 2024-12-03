<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use SoftDeletes, HasApiTokens, HasFactory, Notifiable, HasUuids;
    public static $snakeAttributes = true;
    protected static function boot(): void
    {
      parent::boot();
      self::updating(function ($data) {
        if (isset($data['is_disable'])) {
          $data['disabled_at'] = $data['is_disable'] ? now() : null;
          unset($data['is_disable']);
        }
      });
    }

  /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'birthday',
        'password',
        'avatar_url',
        'phone_number',
        'description',
        'role_code',
        'position_code',
        'is_disable',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

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
        ];
    }

  public function role(): BelongsTo
  {
    return $this->belongsTo(UserRole::class, 'role_code', 'code');
  }

  public function position(): BelongsTo
  {
    return $this->belongsTo(Code::class, 'position_code', 'code');
  }
}
