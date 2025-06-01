<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResources;
use App\Models\Clients;
use Illuminate\Http\Request;

class ApiClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $residents = Clients::all();

        if ($residents->isEmpty()) {
            return response()->json(['message' => 'No record available', 'data' => []], 200);
        }

        return response()->json(['data' => ClientResources::collection($residents)], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
