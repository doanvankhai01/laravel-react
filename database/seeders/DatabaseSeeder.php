<?php

namespace Database\Seeders;

use Database\Seeders\Base\AddressSeeder;
use Database\Seeders\Base\CodeSeeder;
use Database\Seeders\Base\CodeTypeSeeder;
use Database\Seeders\Base\ContentTypeSeeder;
use Database\Seeders\Base\ParameterSeeder;
use Database\Seeders\Base\PostTypeSeeder;
use Database\Seeders\Base\UserRoleSeeder;
use Database\Seeders\Base\UserSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
      $this->call([
        CodeTypeSeeder::class,
        CodeSeeder::class,
        ParameterSeeder::class,
        ContentTypeSeeder::class,
        PostTypeSeeder::class,
        UserRoleSeeder::class,
        UserSeeder::class,
        // AddressSeeder::class,
      ]);
    }
}

