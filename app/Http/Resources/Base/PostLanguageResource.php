<?php

namespace App\Http\Resources\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;
/**
 * @OA\Schema(
 *   schema="PostLanguage",
 *   type="object",
 *   required={"id", "isDisable", "createdAt", "updatedAt", "name", "slug", "description", "content", "language"},
 *   @OA\Property(property="id", type="string", format="uuid", description="Primary Key"),
 *   @OA\Property(property="isDisable", type="boolean", description="Indicates if the code is marked as a disable"),
 *   @OA\Property(property="isDelete", type="boolean", description="Indicates if the code is marked as a delete"),
 *   @OA\Property(property="createdAt", type="string", format="date-time", description="Timestamp when the admin was created"),
 *   @OA\Property(property="updatedAt", type="string", format="date-time", description="Timestamp when the admin was updated"),
 *
 *   @OA\Property(property="name", type="string", description="Name of the post language"),
 *   @OA\Property(property="slug", type="string", description="Slug of the post language"),
 *   @OA\Property(property="description", type="string", description="Description of the post language"),
 *   @OA\Property(property="content", type="string", description="Content HTML"),
 *   @OA\Property(property="post", type="object", description="post", ref="#/components/schemas/Post"),
 *   @OA\Property(property="language", type="string", description="Language of the post"),
 * )
 */
class PostLanguageResource extends JsonResource
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
        'slug' => $this->whenHas('slug'),
        'description' => $this->whenHas('description'),
        'content' => $this->whenHas('content'),
        'post' => new PostResource($this->whenLoaded('post')),
        'language' => $this->whenHas('language'),
      ];
    }
}
