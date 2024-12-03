<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;
/**
 * @OA\Schema(
 *   schema="File",
 *   type="object",
 *   required={"id", "createdAt", "updatedAt", "isDisable", "path", "description"},
 *   @OA\Property(property="id", type="string", format="uuid", description="Primary Key"),
 *   @OA\Property(property="createdAt", type="string", format="date-time", description="Timestamp when the admin was created"),
 *   @OA\Property(property="updatedAt", type="string", format="date-time", description="Timestamp when the admin was updated"),
 *   @OA\Property(property="isActive", type="boolean", description="Indicates if the code is marked as a active"),
 *
 *   @OA\Property(property="path", type="string", description="Path of the file"),
 *   @OA\Property(property="description", type="string", description="Description of the file"),
 * )
 */
class FileResource extends JsonResource
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
        Str::camel('created_at') => $this->whenHas('created_at'),
        Str::camel('updated_at') => $this->whenHas('updated_at'),
        Str::camel('is_active') => $this->whenHas('is_active'),

        'path' => $this->whenHas('path'),
        'description' => $this->whenHas('description'),
      ];
    }
}
