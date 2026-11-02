<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class WorkoutSessionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date' => 'required|date',
            'day_type' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:1000',

            'sets' => 'required|array|min:1|max:100',
            'sets.*.exercise_id' => 'required|exists:exercises,id',
            'sets.*.set_number' => 'required|integer|min:1',
            'sets.*.reps' => 'nullable|integer|between:1,500',
            'sets.*.weight_kg' => 'nullable|numeric|between:0,1000',
            'sets.*.duration_seconds' => 'nullable|integer|between:1,7200',
        ];
    }
}
