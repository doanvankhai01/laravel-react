<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AddressDistrict extends Model
{
    use SoftDeletes, HasFactory, HasUuids;

  protected $fillable = ['name', 'description', 'code', 'province_code','is_disable'];
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
  public function wards(): HasMany
  {
    return $this->hasMany(AddressWard::class, 'district_code', 'code');
  }

  public function province(): BelongsTo
  {
    return $this->belongsTo(AddressProvince::class, 'province_code', 'code');
  }
}
