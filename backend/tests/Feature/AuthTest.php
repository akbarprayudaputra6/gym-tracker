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
        'password_confirmation' => 'password123'
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

it('returns token and user object on successful login', function () {
    $user = User::factory()->create([
        'email' => 'ahmad@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'ahmad@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'token',
            'user' => ['id', 'name', 'email'],
        ]);
});

it('fails registration when password confirmation does not match', function () {
    $response = $this->postJson('/api/register', [
        'name'                  => 'Ahmad',
        'email'                 => 'ahmad@example.com',
        'password'              => 'password123',
        'password_confirmation' => 'passwordBeda',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password'])
        ->assertJsonFragment([
            'password' => ['Konfirmasi password tidak cocok.'],
        ]);
});