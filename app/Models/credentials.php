<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Credentials extends Model
{
    //
     use SoftDeletes, HasFactory;
    protected $table = 'credentials';
    protected $fillable = [
        'name',
        'client_id',
        'label',
        'username',
        'password',
        'assigned',
        'available',
        'status',
        'category',
        'remarks',
        'description',
        'organization_name',
    ];


    public function client()
    {
        return $this->belongsTo(Clients::class);
    }

    public function worksheets()
    {
        return $this->belongsToMany(Worksheets::class, 'credential_worksheet');
    }

}
