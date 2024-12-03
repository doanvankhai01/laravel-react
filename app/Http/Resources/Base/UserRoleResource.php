<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;
/**
 * @OA\Schema(
 *   schema="UserRole",
 *   type="object",
 *   required={"id", "isDisable", "createdAt", "updatedAt", "name", "code", "description", "typeCode"},
 *   @OA\Property(property="id", type="string", format="uuid", description="Primary Key"),
 *   @OA\Property(property="isDisable", type="boolean", description="Indicates if the code is marked as a disable"),
 *   @OA\Property(property="isDelete", type="boolean", description="Indicates if the code is marked as a delete"),
 *   @OA\Property(property="createdAt", type="string", format="date-time", description="Timestamp when the admin was created"),
 *   @OA\Property(property="updatedAt", type="string", format="date-time", description="Timestamp when the admin was updated"),
 *
 *   @OA\Property(property="name", type="string", description="Name of the role user"),
 *   @OA\Property(property="code", type="string", description="Code of the role user"),
 *   @OA\Property(property="description", type="string", description="Description of the role user"),
 *   @OA\Property(property="permissions", type="string", description="permissions of the role user"),
 *   @OA\Property(property="users", type="array", description="Type of the code", @OA\Items(ref="#/components/schemas/User")),
 * )
 */
class UserRoleResource extends JsonResource
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
        'permissions' => $this->whenHas('permissions'),
        'users' => UserResource::collection($this->whenLoaded('users')),
      ];
    }
}
