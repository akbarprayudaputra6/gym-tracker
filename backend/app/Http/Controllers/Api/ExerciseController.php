<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ExerciseRequest;
use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExerciseController extends Controller
{
    public function index(Request $request)
    {
        $query = Exercise::whereNull('user_id')->orWhere('user_id', Auth::id());

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->get());
    }

    public function store(ExerciseRequest $request)
    {
        $exercise = $request->user()->exercises()->create($request->validated());
        return response()->json($exercise, 201);
    }

    public function show(ExerciseRequest $request, $id)
    {
        return response()->json(Exercise::find($id));
    }

    public function update(ExerciseRequest $request, $id)
    {
        $exercise = Exercise::find($id);
        $exercise->update($request->validated());

        return response()->json($exercise);
    }

    public function destroy(ExerciseRequest $request, $id)
    {
        Exercise::find($id)->delete();
        return response()->json(['message' => 'Latihan dihapus']);
    }
}
