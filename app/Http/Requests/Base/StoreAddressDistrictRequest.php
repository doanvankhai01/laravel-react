<?php

namespace App\Http\Requests\Base;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressDistrictRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
          'name' => 'required|string|max:255',
          'code' => 'required|string|max:255|unique:address_districts',
          'province_code' => 'required|string|max:255',
          'description' => 'nullable|string',
        ];
    }
}
