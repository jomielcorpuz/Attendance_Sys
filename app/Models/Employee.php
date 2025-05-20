<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use \Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use SoftDeletes, HasFactory;
    protected $table = 'employees';
    protected $fillable = [
        'name',
        'nickname',
        'gender',
        'email',
        'start_date',
        'team_id',
        'rate_per_hour',
        'user_id',
        'employee_number',
    ];

    public function department()
    {
    return $this->belongsTo(Department::class);
    }

    public static function booted()
    {
        static::creating(function ($model) {
            $model->created_by = auth()->id();
        });

        static::updating(function ($model) {
            $model->updated_by = auth()->id();
        });

        static::deleting(function ($model) {
            $model->deleted_by = auth()->id();
            $model->save();
        });
    }

}
