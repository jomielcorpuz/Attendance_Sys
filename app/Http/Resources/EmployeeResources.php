<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResources extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return
        [
             'name'=> $this->name,
             'nickname'=> $this->nickname,
             'gender'=> $this->gender,
             'email'=> $this->email,
             'team_id'=> $this->team_id,
             'employee_number'=> $this->email,
             'user_id'=> $this->email,
             'rate_per_hour'=> $this->email,
             'start_date'=> $this->start_date,

            'created_by' => new UserResources($this->createdBy),


        ];
    }
}
