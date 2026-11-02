<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:5,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/exercises', [App\Http\Controllers\Api\ExerciseController::class, 'index']);
Route::post('/exercises', [App\Http\Controllers\Api\ExerciseController::class, 'store']);
Route::get('/exercises/{id}', [App\Http\Controllers\Api\ExerciseController::class, 'show']);
Route::put('/exercises/{id}', [App\Http\Controllers\Api\ExerciseController::class, 'update']);
Route::delete('/exercises/{id}', [App\Http\Controllers\Api\ExerciseController::class, 'destroy']);


Route::apiResource('sessions', App\Http\Controllers\Api\WorkoutSessionController::class);
