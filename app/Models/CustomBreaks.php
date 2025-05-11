<?php

namespace App\Models;

use \Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class CustomBreaks extends Model
{
    use SoftDeletes;

    protected $table = 'custom_breaks';
    protected $fillable = [
        'employee_id',
        'break_start',
        'break_end',
        'break_duration',
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
