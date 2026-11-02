<?php

use App\Models\User;
use App\Models\Exercise;
use App\Models\WorkoutSession;
use function Pest\Laravel\{actingAs, postJson, getJson, deleteJson};
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('error 422: validasi melempar error jika nilai reps atau beban melebihi batas PRD', function () {
    $user = User::factory()->create();
    $exercise = Exercise::factory()->create(['user_id' => $user->id]);

    $response = actingAs($user, 'sanctum')->postJson('/api/sessions', [
        'date' => '2026-11-02',
        'sets' => [
            [
                'exercise_id' => $exercise->id,
                'set_number' => 1,
                'reps' => 600, // Melebihi batas max 500
                'weight_kg' => 1500.00 // Melebihi batas max 1000 kg
            ]
        ]
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['sets.0.reps', 'sets.0.weight_kg']);
});

test('sukses 201: membuat sesi dan seluruh set secara atomik', function () {
    $user = User::factory()->create();
    $exercise = Exercise::factory()->create(['user_id' => $user->id]);

    $response = actingAs($user, 'sanctum')->postJson('/api/sessions', [
        'date' => '2026-11-02',
        'day_type' => 'push',
        'sets' => [
            [
                'exercise_id' => $exercise->id,
                'set_number' => 1,
                'reps' => 10,
                'weight_kg' => 60.00
            ],
            [
                'exercise_id' => $exercise->id,
                'set_number' => 2,
                'reps' => 8,
                'weight_kg' => 65.00
            ]
        ]
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('day_type', 'push')
        ->assertJsonCount(2, 'sets');

    $this->assertDatabaseHas('workout_sessions', ['user_id' => $user->id]);
    $this->assertDatabaseCount('workout_sets', 2);
});

test('sukses 200: menghapus sesi otomatis menghapus seluruh set di dalamnya (cascade delete)', function () {
    $user = User::factory()->create();
    $exercise = Exercise::factory()->create(['user_id' => $user->id]);

    $session = WorkoutSession::factory()->create(['user_id' => $user->id]);
    $session->sets()->create([
        'exercise_id' => $exercise->id,
        'set_number' => 1,
        'reps' => 10
    ]);

    actingAs($user, 'sanctum')->deleteJson("/api/sessions/{$session->id}")
        ->assertStatus(200);

    $this->assertDatabaseMissing('workout_sessions', ['id' => $session->id]);
    $this->assertDatabaseCount('workout_sets', 0);
});
