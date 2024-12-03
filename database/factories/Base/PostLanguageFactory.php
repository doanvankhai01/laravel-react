<?php

namespace Database\Factories\Base;

use App\Models\Base\Post;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Base\PostLanguage>
 */
class PostLanguageFactory extends Factory
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
        'language' => $this->faker->text(5),
        'name' => $name,
        'slug' => strtoupper(Str::slug($name)),
        'description' => null,
        'content' => null,
      ];
    }
}
