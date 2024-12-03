<?php

namespace Database\Seeders\Base;

use App\Models\Base\PostType;
use Illuminate\Database\Seeder;

class PostTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $list = array(
        ['name' => 'News', 'code' => 'NEWS'], // , 'children' => array(['name' => 'News1', 'code' => 'NEWS1'])
        ['name' => 'Projects', 'code' => 'PROJECTS'],
      );
      foreach ($list as $item) {
        $parent = PostType::factory()->create(['name' => $item['name'], 'code' => $item['code']]);
        if (isset($item['children'])) {
          foreach ($item['children'] as $child) {
            PostType::factory()->create([...$child, 'post_type_id' => $parent['id']]);
          }
        }
      }
    }
}
