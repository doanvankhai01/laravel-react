<?php

namespace Database\Seeders\Base;

use App\Models\Base\CodeType;
use Illuminate\Database\Seeder;

class CodeTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      CodeType::factory()->create(['name' => 'Position', 'code' => 'POSITION']);
    }
}
