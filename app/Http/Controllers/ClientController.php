<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Models\Clients;
use App\Models\Credentials;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClientController extends Controller
{
     public function index()
    {
        $query = Clients::with([
            'credentials' => function ($query) {
                $query->latest(); // Sort credentials by latest created_at
            }
        ]);

        // Optional filters
        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }

        if (request("id")) {
            $query->where("id", request("id"));
        }

        $sortField = request("sort_field", 'id');
        $sortDirection = request("sort_direction", 'asc');

        $query->orderBy($sortField, $sortDirection);

        $clients = $query->paginate(10)->withQueryString();

        return inertia('ClientPanel/Client', [
            'clients_data' => [
                'data' => $clients->items(),
            ],
            'pagination' => [
                'links' => array_values($clients->linkCollection()->toArray()),
                'current_page' => $clients->currentPage(),
                'from' => $clients->firstItem(),
                'to' => $clients->lastItem(),
                'total' => $clients->total(),
                'last_page' => $clients->lastPage(),
            ],
            'queryParams' => request()->query() ?: null,
            'auth' => auth()->check(),
        ]);
    }

    public function storeClient(StoreClientRequest $request)
    {

        Log::info('Incoming request data:', $request->all());

       $validatedData = $request->validated();

        Clients::create($validatedData);



        return redirect()->back()->with('success', 'Client created successfully.');
    }

}
