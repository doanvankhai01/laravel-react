<?php

namespace App\Http\Controllers\Api\Base;

use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Resources\Base\FileResource;
use App\Models\Base\File;
use App\Services\Base\FileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class FileController extends Controller implements HasMiddleware
{
  public static function middleware(): array
  {
    return [
      new Middleware(['auth:sanctum', 'ability:' . ETokenAbility::ACCESS_API->value]),
      new Middleware('throttle:60,1', only: ['store','update','destroy'])
    ];
  }
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
      Gate::authorize(EPermissions::P_FILE_INDEX->name);
      $data = $this->filter(File::query(), false);
      return FileResource::collection($data['data'])
        ->additional(['message' => __('messages.Get List Success')]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): FileResource
    {
      Gate::authorize(EPermissions::P_FILE_STORE->name);
      $userId = $request->user()->id;
      $path = $request->file('file')->store($userId);

      $data = File::create([
        'path' => $path,
        'user_id' => $userId
      ]);
      return (new FileResource($this->loadRelationships($data)))
        ->additional(['message' => __('messages.Create Success')]);
    }

    /**
     * Display the specified resource.
     */
    public function show(File $file): FileResource
    {
      Gate::authorize(EPermissions::P_FILE_SHOW->name);
      return (new FileResource($this->loadRelationships($file)))
        ->additional(['message' => __('messages.Get Detail Success')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, File $file): FileResource
    {
      Gate::authorize(EPermissions::P_FILE_UPDATE->name);
      $file->update(
        $request->validate([
          'description' => 'nullable|string',
          'is_active' => 'sometimes',
        ])
      );
      return (new FileResource($this->loadRelationships($file)))
        ->additional(['message' => __('messages.Update Success')]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $path, FileService $fileService): JsonResponse
    {
      Gate::authorize(EPermissions::P_FILE_DESTROY->name);
      $fileService->destroy($path);
      return response()->json(['message' => __('messages.Delete Success')]);
    }
}
