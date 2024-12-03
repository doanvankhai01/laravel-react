<?php

namespace App\Policies;

use App\Http\Enums\EPermissions;
use Illuminate\Support\Facades\Gate;

class PermissionPolicies
{
  public static function define(): void
  {
    foreach (EPermissions::array() as $key=>$value) {
      Gate::define($value, function ($user) use ($key){
        $role = $user->load(['role'])->role;
        return $role->is_system_admin || in_array($key, $role->permissions);
      });
    }
  }
}
