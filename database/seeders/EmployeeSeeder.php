<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\Team;


class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        // Create employees and ensure department_id matches their team
        $employees = collect();

        Team::all()->each(function ($team) use (&$employees) {
            // Create several employees for this team
            $teamEmployees = Employee::factory()->count(4)->create([
                'team_id' => $team->id,
                'department_id' => $team->department_id,
            ]);

            // Store in overall employee collection
            $employees = $employees->merge($teamEmployees);

            // Pick a random team member as leader
            $randomLeader = $teamEmployees->random();
            $team->update(['team_leader_id' => $randomLeader->id]);
        });
    }
}


