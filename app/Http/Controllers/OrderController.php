<?php

namespace App\Http\Controllers;

use App\Models\orders;
use App\Models\clients as Client; // Add this import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $query = orders::query();

        $sortField = request("sort_field", 'id');
        $sortDirection = request("sort_direction", "asc");
        $perPage = request("per_page", 10);

        $sortableFields = [
            "id", "order_name", "website_url", "master_inbox_domain",
            "registrar_name", "created_at"
        ];

        if (!in_array($sortField, $sortableFields)) {
            $sortField = "id";
        }

        // Filters
        if ($orderName = request("order_name")) {
            $query->where("order_name", "like", "%{$orderName}%");
        }

        if ($clientId = request("client_id")) {
            $query->where("client_id", $clientId);
        }

        $orders = $query->orderBy($sortField, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return inertia('OrderPanel/Order', [
            'order_data' => [
                'data' => $orders->items(),
                'meta' => [
                    'total' => $orders->total(),
                    'per_page' => $orders->perPage(),
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'links' => $orders->linkCollection()->toArray(),
                ],
            ],
            'clients' => Client::all(['id', 'name']),
            'filters' => request()->all(['order_name', 'client_id']),
            'sort_field' => $sortField,
            'sort_direction' => $sortDirection,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            // 'priority' => 'required|in:low,medium,high', // Reverted to enum validation
            'google_sheet_url' => 'nullable|url|max:255',
            'file_date' => 'nullable|date',
        ]);

        try {
            $order = orders::create($validated);
            return redirect()->back()->with('success', 'Order created successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create order');
        }
    }
}