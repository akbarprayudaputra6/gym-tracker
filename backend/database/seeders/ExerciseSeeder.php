<?php

namespace Database\Seeders;

use App\Models\Exercise;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExerciseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $exercises = [
            ['name' => 'Push Up', 'category' => 'push', 'tracking_type' => 'bodyweight_reps'],
            ['name' => 'Bench Press', 'category' => 'push', 'tracking_type' => 'weight_reps'],
            ['name' => 'Pull Up', 'category' => 'pull', 'tracking_type' => 'bodyweight_reps'],
            ['name' => 'Squat', 'category' => 'leg', 'tracking_type' => 'weight_reps'],
            ['name' => 'Plank', 'category' => 'core', 'tracking_type' => 'duration'],
            ['name' => 'Treadmill', 'category' => 'cardio', 'tracking_type' => 'duration'],
        ];

        foreach ($exercises as $ex) {
            Exercise::create(array_merge($ex, ['user_id' => null]));
        }
    }
}
