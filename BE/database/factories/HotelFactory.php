<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class HotelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['hotel', 'apartment', 'hostel'];

        return [
            'user_id' => rand(1, 50),
            'type_id' => rand(1, count($types)),
            'status' => 1,
            'name' => fake()->company(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->email(),
            'description' => fake()->paragraph(rand(20, 50)),

        ];
    }
}
