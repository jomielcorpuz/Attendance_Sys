<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCredentialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'max:255'],

            'assigned' => ['nullable', 'integer', 'min:0'],
            'available' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'string', 'max:50'],
            'label' => ['nullable', 'string', 'max:255'],
            'remarks' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'organization_name' => ['nullable', 'string', 'max:255'],
            'platform' => ['required', 'string', 'max:255'],
            'color_marker' => ['nullable', 'string', 'max:50'],
            'client_id' => ['nullable', 'exists:clients,id'],
            'created_by' => ['nullable', 'exists:users,id'],
        ];
    }

}

