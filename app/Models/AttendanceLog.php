<?php

namespace App\Models;

use \Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class AttendanceLog extends Model
{
    use SoftDeletes;
    //
    protected $table = 'attendance_logs';
    protected $fillable = [
        'employee_id',
        'clock_in',
        'clock_out',
        'status',
        'gross_hours',
        'break_minutes',
        'rendered_hours',
        'earned_amount',
        'logged_by',
        'notes',
    ];


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
