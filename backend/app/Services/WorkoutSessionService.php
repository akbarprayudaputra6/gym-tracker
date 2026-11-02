<?php

namespace App\Services;

use App\Models\WorkoutSession;
use Illuminate\Support\Facades\DB;

class WorkoutSessionService
{
    public function createSession(array $data, int $userId): WorkoutSession
    {
        // DB::transaction memastikan seluruh Sesi dan Set tersimpan atau dibatalkan total
        return DB::transaction(function () use ($data, $userId) {
            $session = WorkoutSession::create([
                'user_id' => $userId,
                'date' => $data['date'],
                'day_type' => $data['day_type'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($data['sets'] as $set) {
                $session->sets()->create([
                    'exercise_id' => $set['exercise_id'],
                    'set_number' => $set['set_number'],
                    'reps' => $set['reps'] ?? null,
                    'weight_kg' => $set['weight_kg'] ?? null,
                    'duration_seconds' => $set['duration_seconds'] ?? null,
                ]);
            }

            return $session->load('sets.exercise');
        });
    }
}
