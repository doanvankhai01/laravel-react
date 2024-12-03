<?php

namespace Database\Factories\Base;

use App\Models\Base\CodeType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Base\Code>
 */
class CodeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
      $name = $this->faker->unique()->sentence(5);
      return [
        'name' => $name,
        'code' => strtoupper(Str::slug($name)),
        'description' => null,
        'type_code' => fn () => CodeType::factory()->create()->code
      ];
    }
}
