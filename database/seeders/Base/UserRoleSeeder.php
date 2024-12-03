<?php

namespace Database\Seeders\Base;

use App\Http\Enums\EPermissions;
use App\Models\Base\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      UserRole::factory()->create(['name' => 'Super Admin', 'code' => 'SUPER-ADMIN', 'is_system_admin' => true, 'permissions' => []]);
      UserRole::factory()->create(['name' => 'Admin', 'code' => 'ADMIN', 'is_system_admin' => false, 'permissions' => EPermissions::values()]);
    }
}
