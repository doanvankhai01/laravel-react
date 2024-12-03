<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;
/**
 * @OA\Schema(
 *   schema="Content",
 *   type="object",
 *   required={"id", "isDisable", "createdAt", "updatedAt", "name", "imageUrl", "order", "typeCode"},
 *   @OA\Property(property="id", type="string", format="uuid", description="Primary Key"),
 *   @OA\Property(property="isDisable", type="boolean", description="Indicates if the code is marked as a disable"),
 *   @OA\Property(property="isDelete", type="boolean", description="Indicates if the code is marked as a delete"),
 *   @OA\Property(property="createdAt", type="string", format="date-time", description="Timestamp when the admin was created"),
 *   @OA\Property(property="updatedAt", type="string", format="date-time", description="Timestamp when the admin was updated"),
 *
 *   @OA\Property(property="name", type="string", description="Name of the content"),
 *   @OA\Property(property="imageUrl", type="string", description="Image url of the content"),
 *   @OA\Property(property="order", type="string", description="Order of the content"),
 *   @OA\Property(property="typeCode", type="string", description="Code of the type"),
 *   @OA\Property(property="type", type="object", description="Type of the content", ref="#/components/schemas/ContentType"),
 *   @OA\Property(property="languages", type="string", description="Content language"),
 * )
 */
class ContentResource extends JsonResource
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
        Str::camel('image_url') => $this->whenHas('image_url'),
        'order' => $this->whenHas('order'),
        Str::camel('type_code') => $this->whenHas('type_code'),
        'type' => new ContentTypeResource($this->whenLoaded('type')),
        'languages' => ContentLanguageResource::collection($this->whenLoaded('languages')),
      ];
    }
}
