<?php

namespace Database\Factories\Base;

use App\Models\Base\AddressProvince;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Base\AddressDistrict>
 */
class AddressDistrictFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
      $name = $this->faker->unique()->sentence(2);
      return [
        'name' => $name,
        'code' => strtoupper(Str::slug($name)),
        'description' => null,
        'province_code' => fn () => AddressProvince::factory()->create()->code
      ];
    }
}
