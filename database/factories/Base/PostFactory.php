<?php

namespace Database\Factories\Base;

use App\Models\Base\PostLanguage;
use App\Models\Base\PostType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Base\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
      return [
        'image_url' => $this->faker->imageUrl,
        'type_code' => fn () => PostType::factory()->create()->code
      ];
    }
}
