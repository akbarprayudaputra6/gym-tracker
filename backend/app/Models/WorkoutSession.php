<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'date', 'day_type', 'notes'])]
class WorkoutSession extends Model
{
    use HasFactory;

    public function sets()
    {
        return $this->hasMany(WorkoutSet::class);
    }
}
