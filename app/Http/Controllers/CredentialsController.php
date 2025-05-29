<?php

namespace App\Http\Controllers;

use App\Models\Credentials;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CredentialsController extends Controller
{
  public function index()
{
    $query = Credentials::query()->with('client');

    $sortField = request("sort_field", 'id');
    $sortDirection = request("sort_direction", "asc");
    $perPage = request("per_page", 10);

    $sortableFields = [
        "id", "name", "username", "assigned", "available", "status", "label", "created_at"
    ];

    if (!in_array($sortField, $sortableFields)) {
        $sortField = "id";
    }

    // Direct filters
    foreach (['name', 'username', 'id', 'status', 'label', 'organization_name', 'category'] as $field) {
        if ($value = request($field)) {
            $query->where($field, 'like', "%{$value}%");
        }
    }

    // Client filter
    if ($clientId = request('client_id')) {
        $query->where('client_id', $clientId);
    }

    // Search filter
    if ($search = request('search')) {
        $filterColumn = request('filter_column');
        $allowedSearchable = ["name", "username", "label", "status", "category", "client_name"];

        if ($filterColumn && in_array($filterColumn, $allowedSearchable)) {
            if ($filterColumn === 'client_name') {
                $query->whereHas('client', fn($q) => $q->where('name', 'like', "%{$search}%"));
            } else {
                $query->where($filterColumn, 'like', "%{$search}%");
            }
        } else {
            $query->where(function ($q) use ($search) {
                $q->where("name", "LIKE", "%{$search}%")
                  ->orWhere("username", "LIKE", "%{$search}%")
                  ->orWhere("label", "LIKE", "%{$search}%")
                  ->orWhere("status", "LIKE", "%{$search}%")
                  ->orWhere("category", "LIKE", "%{$search}%")
                  ->orWhereHas('client', function ($q) use ($search) {
                      $q->where("name", "LIKE", "%{$search}%");
                  });
            });
        }
    }

    $credentials = $query
        ->orderBy($sortField, $sortDirection)
        ->paginate($perPage)
        ->onEachSide(1);

    return inertia('CredentialsPanel/Credentials', [
        'credentials_data' => [
            'data' => $credentials->items(),
        ],
        'pagination' => [
            'links' => array_values($credentials->linkCollection()->toArray()),
            'current_page' => $credentials->currentPage(),
            'from' => $credentials->firstItem(),
            'to' => $credentials->lastItem(),
            'total' => $credentials->total(),
            'last_page' => $credentials->lastPage(),
        ],
        'queryParams' => request()->query() ?: [],
        'auth' => Auth::check(),
    ]);
}

}
