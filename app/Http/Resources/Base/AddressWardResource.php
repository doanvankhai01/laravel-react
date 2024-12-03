<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;
/**
 * @OA\Schema(
 *   schema="AddressWard",
 *   type="object",
 *   required={"id", "isDisable", "createdAt", "updatedAt", "name", "code", "description", "districtCode"},
 *   @OA\Property(property="id", type="string", format="uuid", description="Primary Key"),
 *   @OA\Property(property="isDisable", type="boolean", description="Indicates if the code is marked as a disable"),
 *   @OA\Property(property="isDelete", type="boolean", description="Indicates if the code is marked as a delete"),
 *   @OA\Property(property="createdAt", type="string", format="date-time", description="Timestamp when the admin was created"),
 *   @OA\Property(property="updatedAt", type="string", format="date-time", description="Timestamp when the admin was updated"),
 *
 *   @OA\Property(property="name", type="string", description="Name of the ward"),
 *   @OA\Property(property="code", type="string", description="Code of the ward"),
 *   @OA\Property(property="description", type="string", description="Description of the ward"),
 *   @OA\Property(property="districtCode", type="string", description="Code of the district"),
 *   @OA\Property(property="district", type="object", description="Districts of the address", ref="#/components/schemas/AddressDistrict"),
 * )
 */
class AddressWardResource extends JsonResource
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
        'description' => $this->whenHas('description'),
        Str::camel('district_code') => $this->whenHas('district_code'),
        'district' => new AddressDistrictResource($this->whenLoaded('district')),
      ];
    }
}
