<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
         $departments = collect([
        'Operations',
        'Customer Service',
        'Finance',
        'IT',
        ]);

        $departments->each(function ($dept) {
        \App\Models\Department::create(['name' => $dept]);
        });

         $operations = \App\Models\Department::where('name', 'Operations')->first();
        \App\Models\Team::factory(9)->create(['department_id' => $operations->id]);


        $customerService = \App\Models\Department::where('name', 'Customer Service')->first();
        \App\Models\Team::factory()->create(['department_id' => $customerService->id]);

        $this->call(EmployeeSeeder::class);


        User::factory(10)->create();

        // Create teams first
        Team::factory(5)->create();

        // Create one test user manually
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);





    }
}

