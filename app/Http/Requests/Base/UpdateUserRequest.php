<?php

namespace App\Http\Requests\Base;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
      $rule = 'string|max:255';
      return [
        'name' => $rule,
        'avatar_url' => $rule,
        'password' => 'string|confirmed|max:255',
        'birthday' => 'nullable|date',
        'role_code' => $rule,
        'position_code' => $rule,
        'email' => 'string|unique:users,email,'.$this->user->id,
        'phone_number' => 'string|unique:users,phone_number,'.$this->user->id,
        'description' => 'nullable|string',
        'is_disable' => 'bool'
      ];
    }
}
