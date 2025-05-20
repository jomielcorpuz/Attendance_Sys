<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition(): array
    {
          $team = Team::inRandomOrder()->first();
        return [
            'name' => $this->faker->name,
            'nickname' => $this->faker->firstName,
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'position' => $this->faker->jobTitle,
            'status' => $this->faker->randomElement(['Active', 'Inactive']),
            'email' => $this->faker->unique()->safeEmail,
             'team_id' => $team?->id,
             'department_id' => $team?->department_id,
            'rate_per_hour' => $this->faker->randomFloat(2, 100, 1000),
            'user_id' => User::inRandomOrder()->first()?->id,
            'employee_number' => $this->faker->unique()->numerify('EMP-####'),
            'start_date' => $this->faker->date('Y-m-d'),
        ];
    }
}

