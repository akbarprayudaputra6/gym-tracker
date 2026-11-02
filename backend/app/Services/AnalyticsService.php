<?php

namespace App\Services;

use App\Models\Exercise;
use App\Models\WorkoutSet;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getExerciseProgress(int $userId, int $exerciseId, ?string $startDate = null, ?string $endDate = null): array
    {
        $exercise = Exercise::where(function ($query) use ($userId) {
            $query->whereNull('user_id')->orWhere('user_id', $userId);
        })->where('id', $exerciseId)->firstOrFail();

        $query = WorkoutSet::query()
            ->join('workout_sessions', 'workout_sets.workout_session_id', '=', 'workout_sessions.id')
            ->where('workout_sessions.user_id', $userId)
            ->where('workout_sets.exercise_id', $exerciseId);

        if ($startDate) {
            $query->where('workout_sessions.date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('workout_sessions.date', '<=', $endDate);
        }

        $progressData = $query->select(
            'workout_sessions.date',
            DB::raw('MAX(workout_sets.weight_kg) as max_weight'),
            DB::raw('SUM(workout_sets.weight_kg * workout_sets.reps) as total_volume')
        )
            ->groupBy('workout_sessions.date')
            ->orderBy('workout_sessions.date', 'asc')
            ->get();

        return [
            'exercise' => [
                'id' => $exercise->id,
                'name' => $exercise->name,
                'category' => $exercise->category,
            ],
            'data' => $progressData,
        ];
    }
}
