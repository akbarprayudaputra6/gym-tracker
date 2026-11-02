<?php

use App\Models\User;
use App\Models\Exercise;
use App\Models\WorkoutSession;
use App\Models\WorkoutSet;
use function Pest\Laravel\{actingAs, getJson};
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('sukses 200: mengembalikan agregasi max weight dan volume per tanggal latihan', function () {
    $user = User::factory()->create();
    $exercise = Exercise::factory()->create(['user_id' => $user->id]);

    $session = WorkoutSession::factory()->create([
        'user_id' => $user->id,
        'date' => '2026-11-01',
    ]);

    WorkoutSet::factory()->create([
        'workout_session_id' => $session->id,
        'exercise_id' => $exercise->id,
        'reps' => 10,
        'weight_kg' => 50.00,
    ]);

    WorkoutSet::factory()->create([
        'workout_session_id' => $session->id,
        'exercise_id' => $exercise->id,
        'reps' => 8,
        'weight_kg' => 60.00,
    ]);

    $response = actingAs($user, 'sanctum')->getJson("/api/exercises/{$exercise->id}/progress");

    $response->assertStatus(200)
        ->assertJsonPath('data.0.max_weight', 60)
        ->assertJsonPath('data.0.total_volume', 980); // (10*50) + (8*60) = 500 + 480 = 980
});
