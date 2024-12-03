<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;
/**
 * @OA\Schema(
 *   schema="Parameter",
 *   type="object",
 *   required={"id", "isDisable", "createdAt", "updatedAt", "name", "code", "vi", "en"},
 *   @OA\Property(property="id", type="string", format="uuid", description="Primary Key"),
 *   @OA\Property(property="isDisable", type="boolean", description="Indicates if the code is marked as a disable"),
 *   @OA\Property(property="isDelete", type="boolean", description="Indicates if the code is marked as a delete"),
 *   @OA\Property(property="createdAt", type="string", format="date-time", description="Timestamp when the admin was created"),
 *   @OA\Property(property="updatedAt", type="string", format="date-time", description="Timestamp when the admin was updated"),
 *
 *   @OA\Property(property="name", type="string", description="Name of the parameter"),
 *   @OA\Property(property="code", type="string", description="Code of the parameter"),
 *   @OA\Property(property="contentVi", type="string", description="Content of the parameter by language vietnamese"),
 *   @OA\Property(property="contentEn", type="string", description="Content of the parameter by language english"),
 * )
 */
class ParameterResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
      return [
        'id' => $this->whenHas('id'),
        Str::camel('is_disable') => $this->disabled_at != null,
        Str::camel('is_delete') => $this->deleted_at != null,
        Str::camel('created_at') => $this->whenHas('created_at'),
        Str::camel('updated_at') => $this->whenHas('updated_at'),

        'name' => $this->whenHas('name'),
        'code' => $this->whenHas('code'),
        Str::camel('content_vi') => $this->whenHas('content_vi'),
        Str::camel('content_en') => $this->whenHas('content_en'),
      ];
    }
}
