<?php

namespace Database\Factories\Base;

use App\Models\Base\AddressDistrict;
use App\Models\Base\AddressProvince;
use App\Models\Base\AddressWard;
use App\Models\Base\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Base\Address>
 */
class AddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
      return [
        'address' => $this->faker->text,
        'province_code' => fn () => AddressProvince::factory()->create()->code,
        'district_code' => fn () => AddressDistrict::factory()->create()->code,
        'ward_code' => fn () => AddressWard::factory()->create()->code,
      ];
    }
}
