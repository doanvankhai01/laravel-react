<?php

namespace App\Models\Base;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class File extends Model
{
  use HasFactory, HasUuids;
  protected $fillable = ['path', 'description', 'is_active', 'user_id'];

  protected function path(): Attribute
  {
    return Attribute::make(
      get: fn (string $value) => env('APP_URL', 'http://localhost').':'.env('APP_PORT', '3000').'/storage/' .$value,
    );
  }
}
