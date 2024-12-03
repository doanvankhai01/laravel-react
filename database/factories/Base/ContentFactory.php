<?php

namespace Database\Factories\Base;

use App\Models\Base\ContentLanguage;
use App\Models\Base\ContentType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Base\Content>
 */
class ContentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
      return [
        'name' => $this->faker->unique()->sentence(2),
        'image_url' => $this->faker->imageUrl,
        'order' => $this->faker->numberBetween(),
        'type_code' => fn () => ContentType::factory()->create()->code,
      ];
    }
}
