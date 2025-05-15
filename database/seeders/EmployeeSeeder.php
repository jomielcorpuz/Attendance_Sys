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
        // Create employees
        $employees = Employee::factory()->count(20)->create();

        // Assign a random employee as leader to each team
        Team::all()->each(function ($team) use ($employees) {
            $randomLeader = $employees->random();
            $team->update(['team_leader_id' => $randomLeader->id]);
        });
    }
}

