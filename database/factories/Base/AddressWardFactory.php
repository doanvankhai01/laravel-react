<?php

namespace Database\Factories\Base;

use App\Models\Base\AddressDistrict;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Base\AddressWard>
 */
class AddressWardFactory extends Factory
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
        'district_code' => fn () => AddressDistrict::factory()->create()->code
      ];
    }
}
