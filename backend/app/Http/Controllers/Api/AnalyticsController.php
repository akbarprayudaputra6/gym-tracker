<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function __construct(private AnalyticsService $analyticsService) {}

    public function exerciseProgress(Request $request, $exerciseId)
    {
        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $result = $this->analyticsService->getExerciseProgress(
            $request->user()->id,
            (int) $exerciseId,
            $validated['start_date'] ?? null,
            $validated['end_date'] ?? null
        );

        return response()->json($result);
    }
}
