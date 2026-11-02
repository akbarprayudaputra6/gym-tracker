<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\{postJson, getJson};

uses(RefreshDatabase::class);

test('register berhasil dan mengembalikan token', function () {
    postJson('/api/register', [
        'name' => 'Akbar',
        'email' => 'akbar@example.com',
        'password' => 'password123',
    ])->assertStatus(201)->assertJsonStructure(['token']);
});

test('login dibatasi 5 kali per menit', function () {
    User::factory()->create(['email' => 'test@example.com', 'password' => 'password123']);

    for ($i = 0; $i < 5; $i++) {
        postJson('/api/login', ['email' => 'test@example.com', 'password' => 'salah']);
    }

    // Percobaan ke-6 harus merespons 429 Too Many Requests
    postJson('/api/login', ['email' => 'test@example.com', 'password' => 'salah'])
        ->assertStatus(429);
});

test('endpoint me mengembalikan data pengguna yang sedang login', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'sanctum')->getJson('/api/me');

    $response->assertStatus(200)
        ->assertJsonPath('data.email', $user->email);
});
