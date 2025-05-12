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
             'employee_id'=> $this->employee_id,
             'clock_in'=> $this->clock_in,
             'clock_out'=> $this->clock_out,
             'status'=> $this->status,
             'gross_hours'=> $this->gross_hours,
             'break_minutes'=> $this->break_minutes,
             'rendered_hours'=> $this->rendered_hours,
             'earned_amount'=> $this->earned_amount,
             'logged_by'=> $this->logged_by,
             'notes'=> $this->notes,

            'created_by' => new UserResources($this->createdBy),


        ];
    }
}
