<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\WorkoutSession;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WorkoutSession>
 */
class WorkoutSessionFactory extends Factory
{
    protected $model = WorkoutSession::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'date' => now()->toDateString(),
            'day_type' => 'push',
            'notes' => fake()->sentence(),
        ];
    }
}
