<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkoutSetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'exercise_id' => $this->exercise_id,
            'exercise_name' => $this->whenLoaded('exercise', fn() => $this->exercise->name),
            'set_number' => $this->set_number,
            'reps' => $this->reps,
            'weight_kg' => $this->weight_kg !== null ? (float) $this->weight_kg : null,
            'duration_seconds' => $this->duration_seconds,
        ];
    }
}
