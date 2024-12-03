<?php

namespace Database\Seeders\Base;

use App\Models\Base\Code;
use App\Models\Base\CodeType;
use Illuminate\Database\Seeder;

class CodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $list = array(
        ['name' => 'President & CEO', 'code' => 'PC', 'type_code' => 'POSITION'],
        ['name' => 'CCO', 'code' => 'CCO', 'type_code' => 'POSITION'],
        ['name' => 'Vice Director', 'code' => 'VD', 'type_code' => 'POSITION'],
        ['name' => 'Delivery Manager', 'code' => 'DM', 'type_code' => 'POSITION'],
        ['name' => 'CTO', 'code' => 'CTO', 'type_code' => 'POSITION'],
        ['name' => 'Admin', 'code' => 'AD', 'type_code' => 'POSITION'],
        ['name' => 'Accountant', 'code' => 'ACC', 'type_code' => 'POSITION'],
        ['name' => 'Ai Technical Leader', 'code' => 'ATL', 'type_code' => 'POSITION'],
        ['name' => 'Web-App Technical Leader', 'code' => 'WATL', 'type_code' => 'POSITION'],
        ['name' => 'Project Technical Leader', 'code' => 'PTL', 'type_code' => 'POSITION'],
        ['name' => 'Developer', 'code' => 'DEV', 'type_code' => 'POSITION'],
        ['name' => 'Engineer', 'code' => 'ENG', 'type_code' => 'POSITION'],
        ['name' => 'Business Analyst', 'code' => 'BA', 'type_code' => 'POSITION'],
        ['name' => 'Tester', 'code' => 'TEST', 'type_code' => 'POSITION'],
      );
      foreach ($list as $item) {
        Code::factory()->create($item);
      }
    }
}
