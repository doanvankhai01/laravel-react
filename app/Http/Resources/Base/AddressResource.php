<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;
/**
 * @OA\Schema(
 *   schema="Address",
 *   type="object",
 *   required={"id", "isDisable", "createdAt", "updatedAt", "address", "provinceCode", "districtCode", "wardCode"},
 *   @OA\Property(property="id", type="string", format="uuid", description="Primary Key"),
 *   @OA\Property(property="isDisable", type="boolean", description="Indicates if the code is marked as a disable"),
 *   @OA\Property(property="isDelete", type="boolean", description="Indicates if the code is marked as a delete"),
 *   @OA\Property(property="createdAt", type="string", format="date-time", description="Timestamp when the admin was created"),
 *   @OA\Property(property="updatedAt", type="string", format="date-time", description="Timestamp when the admin was updated"),
 *
 *   @OA\Property(property="address", type="string", description="Address specifically"),
 *   @OA\Property(property="provinceCode", type="string", description="Code of the province"),
 *   @OA\Property(property="province", type="object", description="Province of the address", ref="#/components/schemas/AddressProvince"),
 *   @OA\Property(property="districtCode", type="string", description="Code of the districts"),
 *   @OA\Property(property="district", type="object", description="Districts of the address", ref="#/components/schemas/AddressDistrict"),
 *   @OA\Property(property="wardCode", type="string", description="Code of the ward"),
 *   @OA\Property(property="ward", type="object", description="Wards of the address", ref="#/components/schemas/AddressWard"),
 * )
 */
class AddressResource extends JsonResource
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

        'address' => $this->whenHas('address'),
        Str::camel('province_code') => $this->whenHas('province_code'),
        'province' => new AddressProvinceResource($this->whenLoaded('province')),
        Str::camel('district_code') => $this->whenHas('district_code'),
        'district' => new AddressDistrictResource($this->whenLoaded('district')),
        Str::camel('ward_code') => $this->whenHas('ward_code'),
        'ward' => new AddressProvinceResource($this->whenLoaded('ward')),
        Str::camel('user_id') => $this->whenHas('user_id'),
        'user' => new UserResource($this->whenLoaded('user')),
      ];
    }
}
