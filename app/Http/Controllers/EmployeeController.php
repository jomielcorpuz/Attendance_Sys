<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
     public function index()
    {
           $query = Employee::query();

 $sortField = request("sort_field", 'id');
        $sortDirection = request("sort_direction", "asc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("id")) {
            $query->where("id", request("id"));
        }
        if (request("rate_per_hour")) {
            $query->where("rate_per_hour", request("rate_per_hour"));
        }
        $employee_data_all = $query->orderBy($sortField, $sortDirection)->get();
        $employee_data = $query->orderBy($sortField,$sortDirection)
        ->paginate(10)->onEachSide(1);

        $employee = $query->paginate(10);

        return inertia('EmployeePanel/Employee', [
            'employee_data' => [
            'data' => $employee->items(),

        ],
        'pagination' => [
            "links" => array_values($employee->linkCollection()->toArray()),
            'current_page' => $employee->currentPage(),
            'from' => $employee->firstItem(),
            'to' => $employee->lastItem(),
            'total' => $employee->total(),
            'last_page' => $employee->lastPage(),
        ],
            'queryParams' =>request()->query() ?: null,
            'auth' => auth()->check(),
        ]);
    }
}
