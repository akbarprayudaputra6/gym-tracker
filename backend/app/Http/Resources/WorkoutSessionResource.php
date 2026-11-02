<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkoutSessionResource extends JsonResource
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
            'date' => $this->date,
            'day_type' => $this->day_type,
            'notes' => $this->notes,
            'sets' => WorkoutSetResource::collection($this->whenLoaded('sets')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
