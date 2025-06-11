<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class orders extends Model
{
    protected $fillable = [
        'order_name',
        'description',
        'priority',
        'google_sheet_url',
        'file_date',
        'status'
    ];

    protected $casts = [
        'file_date' => 'date'
    ];
}
