<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\WorkoutSessionRequest;
use App\Http\Resources\WorkoutSessionResource;
use App\Models\WorkoutSession;
use App\Services\WorkoutSessionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkoutSessionController extends Controller
{
    public function __construct(private WorkoutSessionService $service) {}

    public function store(WorkoutSessionRequest $request)
    {
        $session = $this->service->createSession(
            $request->validated(),
            $request->user()->id
        );

        return (new WorkoutSessionResource($session))
            ->response()
            ->setStatusCode(201);
    }

    public function index(Request $request)
    {
        $sessions = WorkoutSession::where('user_id', $request->user()->id)
            ->with('sets.exercise')
            ->latest('date')
            ->get();

        return WorkoutSessionResource::collection($sessions);
    }

    public function show($id)
    {
        $session = WorkoutSession::where('user_id', Auth::id())
            ->where('id', $id)
            ->with('sets.exercise')
            ->firstOrFail();

        return new WorkoutSessionResource($session);
    }

    public function destroy($id)
    {
        $session = WorkoutSession::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $session->delete();

        return response()->json(['message' => 'Sesi latihan dihapus']);
    }
}
