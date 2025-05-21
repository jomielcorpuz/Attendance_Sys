<?php

namespace App\Http\Controllers;

use App\Http\Resources\EmployeeResources;
use App\Models\AttendanceLog;
use App\Models\Employee;
use Illuminate\Http\Request;
class AttendanceController extends Controller
{
    public function index()
    {
        $query = Employee::with('department');

        $sortField = request("sort_field", 'id');
        $sortDirection = request("sort_direction", "asc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("id")) {
            $query->where("id", request("id"));
        }
        if (request("department")) {
            $query->where("department", request("department"));
        }

        $employee_data_all = $query->orderBy($sortField, $sortDirection)->get();
        $employee = $query->paginate(10);

        // Retrieve attendance logs
        $attendance_logs = AttendanceLog::orderBy('created_at', 'desc')->paginate(10);

        return inertia('AttendancePanel/Attendance', [
            'employee_data' => [
                'data' => $employee->items(),
            ],
            'pagination_employee' => [
                "links" => array_values($employee->linkCollection()->toArray()),
                'current_page' => $employee->currentPage(),
                'from' => $employee->firstItem(),
                'to' => $employee->lastItem(),
                'total' => $employee->total(),
                'last_page' => $employee->lastPage(),
            ],
            'attendance_logs' => [
                'data' => $attendance_logs->items(),
            ],
            'pagination_attendance' => [
                "links" => array_values($attendance_logs->linkCollection()->toArray()),
                'current_page' => $attendance_logs->currentPage(),
                'from' => $attendance_logs->firstItem(),
                'to' => $attendance_logs->lastItem(),
                'total' => $attendance_logs->total(),
                'last_page' => $attendance_logs->lastPage(),
            ],
            'queryParams' => request()->query() ?: null,
            'auth' => auth()->check(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'status' => 'required|in:clock-in,clock-out',
        ]);

        $attendance = AttendanceLog::create([
            'employee_id' => $request->employee_id,
            'status' => $request->status,
            'timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Attendance recorded successfully!',
            'attendance' => $attendance,
        ], 201);
    }

    public function fetchEmployee(Request $request)
    {
        $perPage = request("per_page", 10);
        $employeQuery = Employee::with('department');

        $employee = $employeQuery->paginate($perPage);

        return response()->json([
            'data' => EmployeeResources::collection($employee),
            'pagination_employee' => [
                "links" => array_values($employee->linkCollection()->toArray()),
                'current_page' => $employee->currentPage(),
                'from' => $employee->firstItem(),
                'to' => $employee->lastItem(),
                'total' => $employee->total(),
                'last_page' => $employee->lastPage(),
            ],
        ]);
    }
}
