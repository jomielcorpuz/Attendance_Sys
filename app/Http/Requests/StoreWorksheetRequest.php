<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorksheetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'worksheet_name' => ['nullable', 'string', 'max:255'],
            'client_id' => ['nullable', 'string', 'max:255'],
            'cloudflare_username' => ['nullable', 'string', 'max:255'],
            'googlepanel_username' => ['nullable', 'string', 'max:255'],

            'cloudflare_credential_id' => ['nullable', 'exists:credentials,id'],
            'googlepanel_credential_id' => ['nullable', 'exists:credentials,id'],

            'no_of_domains' => ['nullable', 'integer', 'min:0'],
            'no_of_users_per_domain' => ['nullable', 'integer', 'min:0'],
            'total_users' => ['nullable', 'integer', 'min:0'],

            'workspace' => ['nullable', 'string', 'max:255'],
            'tag' => ['nullable', 'string', 'max:255'],
            'sheet_link' => ['nullable', 'string', 'max:2048'],
            'timestamp_cdt' => ['nullable', 'date'],
            'details' => ['nullable', 'string'],
        ];
    }

}

