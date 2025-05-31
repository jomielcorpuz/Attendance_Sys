<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

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
        'platform',
        'color_marker',
        'client_id',
        'created_by',
        'updated_by',
        'deleted_by',
        'ip_address',
        'created_at',
        'updated_at',
        'deleted_at',
    ];


    public function client()
    {
        return $this->belongsTo(Clients::class);
    }

    public function worksheets()
    {
        return $this->belongsToMany(Worksheets::class, 'credential_worksheet');
    }

    public function activityLogs()
    {
        return $this->hasMany(CredentialActivityLog::class);
    }


    // ✅ Auto-set created_by, updated_by, ip_address

    protected static function booted()
    {
        static::created(function ($credential) {
            CredentialActivityLog::create([
                'credential_id' => $credential->id,
                'user_id' => Auth::id(),
                'action' => 'created',
                'changes' => $credential->getAttributes(),
                'ip_address' => Request::ip(),
            ]);
        });

        static::updating(function ($credential) {
            $original = $credential->getOriginal();
            $changes = [];

            foreach ($credential->getDirty() as $field => $newValue) {
                $changes[$field] = [
                    'old' => $original[$field] ?? null,
                    'new' => $newValue,
                ];
            }

            CredentialActivityLog::create([
                'credential_id' => $credential->id,
                'user_id' => Auth::id(),
                'action' => 'updated',
                'changes' => $changes,
                'ip_address' => Request::ip(),
            ]);
        });

        static::deleted(function ($credential) {
            CredentialActivityLog::create([
                'credential_id' => $credential->id,
                'user_id' => Auth::id(),
                'action' => 'deleted',
                'changes' => null,
                'ip_address' => Request::ip(),
            ]);
        });
    }

}
