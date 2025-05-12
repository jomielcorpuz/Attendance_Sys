<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLog;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index()
    {
        $query = AttendanceLog::query();

        $sortField = request("sort_field", 'id');
        $sortDirection = request("sort_direction", "asc");

        if (request("title")) {
            $query->where("title", "like", "%" . request("title") . "%");
        }
        if (request("id")) {
            $query->where("id", request("id"));
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }
        $blottercase_data_all = $query->orderBy($sortField, $sortDirection)->get();
        $blottercase_data = $query->orderBy($sortField,$sortDirection)
        ->paginate(10)->onEachSide(1);
        $blottercases = $query->paginate(10);
        return inertia('BlotterPanel/Blotters', [
            'blottercase_data' => [
            'data' => $blottercases->items(),

        ],
        'pagination' => [
            "links" => array_values($blottercases->linkCollection()->toArray()),
            'current_page' => $blottercases->currentPage(),
            'from' => $blottercases->firstItem(),
            'to' => $blottercases->lastItem(),
            'total' => $blottercases->total(),
            'last_page' => $blottercases->lastPage(),
        ],
            'queryParams' =>request()->query() ?: null,
            'auth' => auth()->check(),
        ]);
    }
}
