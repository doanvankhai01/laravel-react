<?php

namespace App\Http\Requests\Base;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
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
      $validation_rules = [
        'type_code' => 'required_if:disabled_at,|string|max:255',
        'created_at' => '',
        'image_url' => $rule,
        'languages' => 'required_if:disabled_at,|array',
        'is_disable' => 'boolean',
      ];
      $request = $this->json()->all();
      if (isset($request['languages'])) {
        for ($i = 0; $i < count($request['languages']); $i++) {
          $validation_rules += [
            "languages.$i.id" => 'required_if:disabled_at,|string',
            "languages.$i.language" => 'required_if:disabled_at,|string',
            "languages.$i.name" => 'required_if:disabled_at,|string|max:255|unique:post_languages,name,'. $request['languages'][$i]['id'],
            "languages.$i.slug" => 'required_if:disabled_at,|string|max:255|unique:post_languages,slug,'. $request['languages'][$i]['id'],
            "languages.$i.description" => $rule,
            "languages.$i.content" => $rule,
          ];
        }
      }
      return $validation_rules;
    }
}
