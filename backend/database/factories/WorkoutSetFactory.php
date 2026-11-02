<?php

namespace Database\Factories;

use App\Models\Exercise;
use App\Models\WorkoutSession;
use App\Models\WorkoutSet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WorkoutSet>
 */
class WorkoutSetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'workout_session_id' => WorkoutSession::factory(),
            'exercise_id' => Exercise::factory(),
            'set_number' => 1,
            'reps' => fake()->numberBetween(1, 15),
            'weight_kg' => fake()->randomFloat(2, 10, 100),
            'duration_seconds' => null,
        ];
    }
}
