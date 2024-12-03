<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostType extends Model
{
  use SoftDeletes, HasFactory, HasUuids;
  protected $fillable = ['code', 'name', 'description', 'post_type_id', 'is_disable'];
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
  public function posts(): HasMany
  {
    return $this->hasMany(Post::class, 'type_code', 'code');
  }

  public function children(): HasMany
  {
    return $this->hasMany(PostType::class)->with(['children' => function ($query) {
      $query->withCount('posts');
    }]);
  }
}
