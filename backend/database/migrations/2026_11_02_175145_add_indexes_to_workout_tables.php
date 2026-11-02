<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Index Komposit untuk tabel workout_sessions
        Schema::table('workout_sessions', function (Blueprint $table) {
            // Mempercepat filter user_id + rentang tanggal + orderBy date
            $table->index(['user_id', 'date']);
        });

        // 2. Index Komposit untuk tabel workout_sets
        Schema::table('workout_sets', function (Blueprint $table) {
            // Mempercepat pencarian exercise_id yang terhubung ke workout_session_id
            $table->index(['exercise_id', 'workout_session_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('workout_sessions', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'date']);
        });

        Schema::table('workout_sets', function (Blueprint $table) {
            $table->dropIndex(['exercise_id', 'workout_session_id']);
        });
    }
};
