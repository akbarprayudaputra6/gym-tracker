<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'workout_session_id',
    'exercise_id',
    'set_number',
    'reps',
    'weight_kg',
    'duration_seconds'
])]
class WorkoutSet extends Model
{
    use HasFactory;

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}
