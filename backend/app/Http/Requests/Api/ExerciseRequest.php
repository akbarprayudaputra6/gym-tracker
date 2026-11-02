<?php

namespace App\Http\Requests\Api;

use App\Models\Exercise;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ExerciseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $exerciseId = $this->route('id');

        if (! $exerciseId) {
            return true;
        }

        $exercise = Exercise::find($exerciseId);

        if (! $exercise) {
            abort(404);
        }

        if ($exercise->user_id !== null && $exercise->user_id !== Auth::id()) {
            abort(404);
        }

        if ($exercise->user_id === null && in_array($this->method(), ['PUT', 'PATCH', 'DELETE'])) {
            abort(403, 'Latihan bawaan tidak bisa diubah atau dihapus');
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if (in_array($this->method(), ['GET', 'DELETE'])) {
            return [];
        }

        $exerciseId = $this->route('id');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('exercises')->where(function ($query) {
                    return $query->where('user_id', Auth::id());
                })->ignore($exerciseId),
            ],
            'category' => 'required|in:push,pull,leg,core,cardio',
            'tracking_type' => 'required|in:weight_reps,bodyweight_reps,duration',
        ];
    }

    protected function failedAuthorization()
    {
        // Lempar 404 alih-alih 403 untuk menyembunyikan data
        throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException();
    }
}
