<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Clients extends Model
{
    //
  use SoftDeletes, HasFactory;
    protected $table = 'clients';
    protected $fillable = [
        'name',
        'description',
        'status',
    ];

    public function credentials()
    {
        return $this->hasMany(Credentials::class);
    }

}
