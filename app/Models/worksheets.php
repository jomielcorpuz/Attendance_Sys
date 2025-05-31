<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Worksheets extends Model
    {
        protected $fillable = [
        'worksheet_name',
        'client_id',
        'cloudflare_username',
        'googlepanel_username',
        'cloudflare_credential_id',
        'googlepanel_credential_id',
        'no_of_domains',
        'no_of_users_per_domain',
        'total_users',
        'workspace',
        'tag',
        'sheet_link',
        'timestamp_cdt',
        'status',
        'details',
        'created_by',
        'ip_address',
    ];
    protected $table = 'worksheets';
    public function credentials()
    {
        return $this->belongsToMany(Credentials::class, 'credential_worksheet');
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
