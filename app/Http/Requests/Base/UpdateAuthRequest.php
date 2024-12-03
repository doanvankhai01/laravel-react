<?php

namespace App\Http\Requests\Base;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAuthRequest extends FormRequest
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
          'name' => 'string|max:255',
          'position_code' => 'string|max:255',
          'birthday' => 'nullable|date',
          'email' => 'string|unique:users,email,'.auth()->id(),
          'phone_number' => 'string|unique:users,phone_number,'.auth()->id(),
        ];
    }

  protected function prepareForValidation(): void
  {
    if (isset($this->birthday)) {
      $this->merge([
        'birthday' => Carbon::createFromTimeString($this->birthday)
      ]);
    }
  }
}
