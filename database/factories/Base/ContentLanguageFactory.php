<?php

namespace Database\Factories\Base;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Base\ContentLanguage>
 */
class ContentLanguageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
          'language' => 'en',
          'name' => $this->faker->unique()->sentence(2),
          'description' => null,
          'content' => null,
        ];
    }
}
