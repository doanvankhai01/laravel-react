<?php

namespace App\Models\Base;

use App\Casts\Json;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserRole extends Model
{
    use SoftDeletes, HasFactory, HasUuids;
  protected $fillable = ['name', 'description', 'code', 'permissions', 'is_disable'];
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
  protected $casts = [
    'permissions' => Json::class,
  ];

  protected $attributes = [
    'permissions' => [],
  ];

  public function users(): HasMany
  {
    return $this->hasMany(User::class, 'role_code', 'code');
  }
}
