<?php

use App\Models\User;
use App\Models\Exercise;
use function Pest\Laravel\{actingAs, getJson, postJson, putJson, deleteJson};
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('error 422: validasi gagal jika membuat latihan dengan data tidak lengkap atau salah tipe', function () {
    $user = User::factory()->create();

    $response = actingAs($user, 'sanctum')->postJson('/api/exercises', [
        'name' => '', // Kosong
        'category' => 'invalid_category', // Tidak sesuai enum
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'category', 'tracking_type']);
});

test('error 422: nama latihan duplikat untuk pengguna yang sama', function () {
    $user = User::factory()->create();
    Exercise::factory()->create(['user_id' => $user->id, 'name' => 'Bench Press', 'category' => 'push', 'tracking_type' => 'weight_reps']);

    $response = actingAs($user, 'sanctum')->postJson('/api/exercises', [
        'name' => 'Bench Press', // Duplikat
        'category' => 'push',
        'tracking_type' => 'weight_reps'
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors(['name']);
});

test('error 404: melihat, mengubah, atau menghapus latihan milik orang lain tidak mengembalikan 403', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $exerciseUser1 = Exercise::factory()->create(['user_id' => $user1->id]);

    // User 2 mencoba mengakses latihan User 1
    actingAs($user2, 'sanctum')->getJson("/api/exercises/{$exerciseUser1->id}")->assertStatus(404);

    // Berikan payload yang valid agar lolos Request Validation dan masuk ke Controller
    actingAs($user2, 'sanctum')->putJson("/api/exercises/{$exerciseUser1->id}", [
        'name' => 'Hack',
        'category' => 'push',
        'tracking_type' => 'weight_reps'
    ])->assertStatus(404);

    actingAs($user2, 'sanctum')->deleteJson("/api/exercises/{$exerciseUser1->id}")->assertStatus(404);
});

test('error 403: latihan bawaan (katalog) tidak bisa diubah atau dihapus oleh pengguna', function () {
    $user = User::factory()->create();

    $defaultExercise = Exercise::factory()->create([
        'user_id' => null,
        'name' => 'Push Up',
        'category' => 'push',
        'tracking_type' => 'bodyweight_reps'
    ]);

    actingAs($user, 'sanctum')->putJson("/api/exercises/{$defaultExercise->id}", [
        'name' => 'Hack Push Up',
        'category' => 'push',
        'tracking_type' => 'bodyweight_reps'
    ])->assertStatus(403);

    actingAs($user, 'sanctum')->deleteJson("/api/exercises/{$defaultExercise->id}")
        ->assertStatus(403);
});

test('sukses 200: menampilkan katalog latihan bawaan dan milik sendiri, tanpa data orang lain', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    Exercise::factory()->create(['user_id' => null, 'name' => 'Latihan Bawaan']);
    Exercise::factory()->create(['user_id' => $user->id, 'name' => 'Latihan Sendiri']);
    Exercise::factory()->create(['user_id' => $otherUser->id, 'name' => 'Latihan Orang Lain']);

    $response = actingAs($user, 'sanctum')->getJson('/api/exercises');

    $response->assertStatus(200)
        ->assertJsonFragment(['name' => 'Latihan Bawaan'])
        ->assertJsonFragment(['name' => 'Latihan Sendiri'])
        ->assertJsonMissing(['name' => 'Latihan Orang Lain']);
});

test('sukses 201: berhasil membuat latihan baru dan menyimpannya ke database', function () {
    $user = User::factory()->create();

    $response = actingAs($user, 'sanctum')->postJson('/api/exercises', [
        'name' => 'Bulgarian Split Squat',
        'category' => 'leg',
        'tracking_type' => 'weight_reps'
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('name', 'Bulgarian Split Squat');

    $this->assertDatabaseHas('exercises', [
        'user_id' => $user->id,
        'name' => 'Bulgarian Split Squat'
    ]);
});

test('sukses 200: berhasil mengubah latihan milik sendiri', function () {
    $user = User::factory()->create();
    $exercise = Exercise::factory()->create([
        'user_id' => $user->id,
        'name' => 'Nama Lama',
        'category' => 'pull'
    ]);

    $response = actingAs($user, 'sanctum')->putJson("/api/exercises/{$exercise->id}", [
        'name' => 'Nama Baru',
        'category' => 'push',
        'tracking_type' => 'weight_reps'
    ]);

    $response->assertStatus(200)->assertJsonPath('name', 'Nama Baru');

    $this->assertDatabaseHas('exercises', [
        'id' => $exercise->id,
        'name' => 'Nama Baru',
        'category' => 'push'
    ]);
});

test('sukses 200: berhasil menghapus (soft delete) latihan milik sendiri', function () {
    $user = User::factory()->create();
    $exercise = Exercise::factory()->create(['user_id' => $user->id]);

    $response = actingAs($user, 'sanctum')->deleteJson("/api/exercises/{$exercise->id}");

    $response->assertStatus(200);

    $this->assertSoftDeleted('exercises', [
        'id' => $exercise->id
    ]);
});
