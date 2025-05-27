<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorksheetRequest;
use App\Models\Worksheets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class WorksheetController extends Controller
{
     public function index()
    {

       $query = Worksheets::query();

    // Sorting
    $sortField = request("sort_field", 'id');
    $sortDirection = request("sort_direction", "asc");

    // Filters
    if (request("worksheet_name")) {
        $query->where("worksheet_name", "like", "%" . request("worksheet_name") . "%");
    }

    if (request("id")) {
        $query->where("id", request("id"));
    }

    if (request("client_id")) {
        $query->where("client_id", request("client_id"));
    }

    // Paginate
    $worksheets = $query->orderBy($sortField, $sortDirection)
        ->paginate(10)
        ->onEachSide(1);

    return inertia('WorksheetPanel/Worksheet', [
        'worksheet_data' => [
            'data' => $worksheets->items(),
        ],
        'pagination' => [
            'links' => array_values($worksheets->linkCollection()->toArray()),
            'current_page' => $worksheets->currentPage(),
            'from' => $worksheets->firstItem(),
            'to' => $worksheets->lastItem(),
            'total' => $worksheets->total(),
            'last_page' => $worksheets->lastPage(),
        ],
        'queryParams' => request()->query() ?: null,
        'auth' => Auth::check(),
    ]);
    }


    public function storeWorksheet(StoreWorksheetRequest $request)
    {

        Log::info('Incoming request data:', $request->all());

       $validatedData = $request->validated();
        $validatedData['created_by'] = Auth::id();
        $validatedData['ip_address'] = $request->ip();

        Worksheets::create($validatedData);



        return redirect()->back()->with('success', 'Worksheet created successfully.');
    }
}
