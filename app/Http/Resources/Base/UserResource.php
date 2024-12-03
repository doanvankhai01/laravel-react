<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;
/**
 * @OA\Schema(
 *   schema="User",
 *   type="object",
 *   required={"id", "isDisable", "createdAt", "updatedAt", "name", "email", "avatar_url", "birthday", "phoneNumber", "description", "roleCode", "positionCode" },
 *   @OA\Property(property="id", type="string", format="uuid", description="Primary Key"),
 *   @OA\Property(property="isDisable", type="boolean", description="Indicates if the code is marked as a disable"),
 *   @OA\Property(property="isDelete", type="boolean", description="Indicates if the code is marked as a delete"),
 *   @OA\Property(property="createdAt", type="string", format="date-time", description="Timestamp when the admin was created"),
 *   @OA\Property(property="updatedAt", type="string", format="date-time", description="Timestamp when the admin was updated"),
 *
 *   @OA\Property(property="name", type="string", description="Name of the user"),
 *   @OA\Property(property="email", type="string", description="Email of the user"),
 *   @OA\Property(property="avatarUrl", type="string", description="Url avatar of the user"),
 *   @OA\Property(property="birthday", type="string", description="Birthday of the user"),
 *   @OA\Property(property="phoneNumber", type="string", description="Phone number of the user"),
 *   @OA\Property(property="description", type="string", description="Description of the user"),
 *   @OA\Property(property="roleCode", type="string", description="code of the role user"),
 *   @OA\Property(property="role", type="object", description="Role of the user", ref="#/components/schemas/UserRole"),
 *   @OA\Property(property="positionCode", type="string", description="Code of the position user"),
 *   @OA\Property(property="position", type="object", description="Position of the user", ref="#/components/schemas/Code"),
 * )
 */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
      $user = [
        'id' => $this->whenHas('id'),
        Str::camel('is_disable') => $this->disabled_at != null,
        Str::camel('is_delete') => $this->deleted_at != null,
        Str::camel('created_at') => $this->whenHas('created_at'),
        Str::camel('updated_at') => $this->whenHas('updated_at'),

        'name' => $this->whenHas('name'),
        'email' => $this->whenHas('email'),
        Str::camel('avatar_url') => $this->whenHas('avatar_url'),
        'birthday' => $this->whenHas('birthday'),
        Str::camel('phone_number') => $this->whenHas('phone_number'),
        'description' => $this->whenHas('description'),
        Str::camel('role_code') => $this->whenHas('role_code'),
        'role' => new UserRoleResource($this->whenLoaded('role')),
        Str::camel('position_code') => $this->whenHas('position_code'),
        'position' => new CodeResource($this->whenLoaded('position')),
      ];
      return isset($this->token) ? [
        'token' => $this->whenHas('token'),
        Str::camel('refresh-token') => $this->whenHas('refresh-token'),
        'user' => $user
      ] : $user;
    }
}
