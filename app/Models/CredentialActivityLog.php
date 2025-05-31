<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CredentialActivityLog extends Model
{
    protected $fillable = [
        'credential_id',
        'user_id',
        'action',
        'changes',
        'ip_address',
        'remarks',
    ];

    protected $casts = [
        'changes' => 'array',
    ];

    public function credential()
    {
        return $this->belongsTo(Credentials::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

