<?php

namespace App\Http\Requests\Base;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
      $rule = 'required|string|max:255';
        return [
          'name' => $rule,
          'avatar_url' => 'string|max:255',
          'password' => 'required|confirmed|string|max:255',
          'birthday' => 'nullable|date',
          'role_code' => $rule,
          'position_code' => $rule,
          'email' => 'required|string|unique:users',
          'phone_number' => 'required|string|unique:users',
          'description' => 'nullable|string',
        ];
    }
}
