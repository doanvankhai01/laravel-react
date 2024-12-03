<?php

namespace Database\Seeders\Base;

use App\Models\Base\AddressDistrict;
use App\Models\Base\AddressProvince;
use App\Models\Base\AddressWard;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class AddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $provinces = json_decode(File::get('database/json/provinces.json'));
      foreach ($provinces as $province) {
        $districts = $province->districts;
        unset($province->districts);
        AddressProvince::factory()->create((array) $province);

        foreach ($districts as $district) {
          $wards = $district->wards;
          unset($district->wards);
          $district->province_code = $province->code;
          AddressDistrict::factory()->create((array) $district);

          foreach ($wards as $ward) {
            $ward->district_code = $district->code;
            AddressWard::factory()->create((array) $ward);
          }
        }
      }
    }
}
