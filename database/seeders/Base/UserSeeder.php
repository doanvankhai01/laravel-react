<?php

namespace Database\Seeders\Base;

use App\Models\Base\User;
use App\Models\Base\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      User::factory()->create(['role_code' => 'SUPER-ADMIN', 'email' => 'super-admin@gmail.com', 'position_code' => 'PC']);
      User::factory()->create(['role_code' => 'ADMIN', 'email' => 'admin@gmail.com', 'position_code' => 'AD']);
    }
}
