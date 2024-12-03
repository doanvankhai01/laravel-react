<?php

namespace App\Http\Requests\Base;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
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
      $rule = 'nullable|string';
        return [
          'type_code' => 'required|string|max:255',
          'created_at' => '',
          'image_url' => $rule,
          'languages' => 'required|array',
          'languages.*.language' => 'required|string',
          'languages.*.name' => 'required|string|max:255|unique:post_languages,name',
          'languages.*.slug' => 'required|string|max:255|unique:post_languages,slug',
          'languages.*.description' => $rule,
          'languages.*.content' => $rule,
        ];
    }
}
