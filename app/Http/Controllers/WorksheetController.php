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

    $sortField = request("sort_field", 'id');
    $sortDirection = request("sort_direction", "asc");
    $perPage = request("per_page", 10);

    $sortableFields = [
        "id", "worksheet_name", "cloudflare_username", "googlepanel_username",
        "no_of_domains", "no_of_users_per_domain", "total_users",
        "workspace", "tag", "timestamp_cdt",
    ];

    if (!in_array($sortField, $sortableFields)) {
        $sortField = "id";
    }

    // Filters
    if ($worksheetName = request("worksheet_name")) {
        $query->where("worksheet_name", "like", "%{$worksheetName}%");
    }

    if ($clientId = request("client_id")) {
        $query->where("client_id", $clientId);
    }

    if ($id = request("id")) {
        $query->where("id", $id);
    }

    if ($workspace = request("workspace")) {
        $query->where("workspace", "like", "%{$workspace}%");
    }

    if ($tag = request("tag")) {
        $query->where("tag", "like", "%{$tag}%");
    }

    if ($cloudflare = request("cloudflare_username")) {
        $query->where("cloudflare_username", "like", "%{$cloudflare}%");
    }

    if ($googlepanel = request("googlepanel_username")) {
        $query->where("googlepanel_username", "like", "%{$googlepanel}%");
    }

    // ✅ Apply dynamic search filter BEFORE paginate
    if ($search = request('search')) {
        $filterColumn = request('filter_column');
        $allowedSearchable = ["worksheet_name", "cloudflare_username", "googlepanel_username", "workspace", "tag"];

        if ($filterColumn && in_array($filterColumn, $allowedSearchable)) {
            $query->where($filterColumn, 'LIKE', "%{$search}%");
        } else {
            // Search across multiple fields
            $query->where(function ($q) use ($search) {
                $q->where("worksheet_name", "LIKE", "%{$search}%")
                ->orWhere("cloudflare_username", "LIKE", "%{$search}%")
                ->orWhere("googlepanel_username", "LIKE", "%{$search}%")
                ->orWhere("workspace", "LIKE", "%{$search}%")
                ->orWhere("tag", "LIKE", "%{$search}%");
            });
        }
    }

    // ✅ Apply sort and paginate at the very end
    $worksheets = $query
        ->orderBy($sortField, $sortDirection)
        ->paginate($perPage)
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
        'queryParams' => request()->query() ?: [],
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
