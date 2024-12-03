<?php

namespace Database\Seeders\Base;

use App\Models\Base\ContentType;
use Illuminate\Database\Seeder;

class ContentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $list = array(
        ['name' => 'Missions', 'code' => 'MISSIONS'],
        ['name' => 'Services', 'code' => 'SERVICES'],
        ['name' => 'Values', 'code' => 'VALUES'],
        ['name' => 'Members', 'code' => 'MEMBERS'],
        ['name' => 'techniques', 'code' => 'TECHNIQUES'],
        ['name' => 'Partners', 'code' => 'PARTNERS'],
      );
      foreach ($list as $item) {
        ContentType::factory()->create($item);
      }
    }
}
