<?php

namespace App\Http\Controllers\Api\Base;

use App\Events\DataChanged;
use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreContentRequest;
use App\Http\Requests\Base\UpdateContentRequest;
use App\Http\Resources\Base\ContentResource;
use App\Models\Base\Content;
use App\Models\Base\ContentLanguage;
use App\Services\Base\ContentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ContentController extends Controller implements HasMiddleware
{
  protected ContentService $contentService;
  public function __construct(ContentService $contentService)
  {
    $this->relations = ['type', 'languages'];
    $this->fullTextSearch = ['name'];
    $this->contentService = $contentService;
  }

  public static function middleware(): array
  {
    return [
      new Middleware(['auth:sanctum', 'ability:' . ETokenAbility::ACCESS_API->value]),
      new Middleware('throttle:60,1', only: ['store','update','destroy'])
    ];
  }
  /**
   * @OA\Get(path="/api/contents", tags={"Content"}, summary="Get all content",
   *   description="This request is used to get all content when user use the App. This request is using MySql database.",
   *   @OA\Response( response=200, description="Content fetched",
   *     @OA\JsonContent(@OA\Property(property="message", type="string", example="Get List Success"),
   *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Content")))),
   *   @OA\Response(response=401, description="Protected route need to include sign in token as authorization bearer", @OA\JsonContent(@OA\Property(property="message", type="string", example="Protected route need to include sign in token as authorization bearer"))),
   *   security={{"bearerAuth": {}}}
   * )
   */
  public function index(): AnonymousResourceCollection
  {
    Gate::authorize(EPermissions::P_CONTENT_INDEX->name);
    $data = $this->filter(Content::query());
    return ContentResource::collection($data['data'])
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Validation in database.
   */
  public function valid(): JsonResponse
  {
    Gate::authorize(EPermissions::P_CONTENT_INDEX->name);
    $name = \request()->query('name');
    $value = \request()->query('value');
    $id = \request()->query('id');

    if (!isset($name) || !isset($value)  || (!isset($id) && ContentLanguage::where($name, $value)->exists()) || (isset($id) && ContentLanguage::where($name, $value)->where('content_id', '!=', $id)->exists())) {
      return response()->json(['data' => true]);
    }
    return response()->json(['data' => false]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreContentRequest $request): JsonResponse
  {
    Gate::authorize(EPermissions::P_CONTENT_STORE->name);
    $data = $this->contentService->save($request->validated());
    broadcast(new DataChanged('Content', new ContentResource($this->loadRelationships($data, ['languages']))))->toOthers();
    return response()->json(['message' => __('messages.Create Success'), 'id' => $data['id']], 201);
  }

  /**
   * Display the specified resource.
   */
  public function show(Content $content) : ContentResource
  {
    Gate::authorize(EPermissions::P_CONTENT_SHOW->name);
    return (new ContentResource($this->loadRelationships($content)))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateContentRequest $request, Content $content): JsonResponse
  {
    Gate::authorize(EPermissions::P_CONTENT_UPDATE->name);
    $this->contentService->update($request->validated(), $content);
    broadcast(new DataChanged('Content', new ContentResource($this->loadRelationships($content, ['languages']))))->toOthers();
    return response()->json(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Content $content): JsonResponse
  {
    Gate::authorize(EPermissions::P_CONTENT_DESTROY->name);
    DB::transaction(function () use ($content) {
      $languages = ContentLanguage::where('content_id', $content->id)->get();
      foreach ($languages as $language) {
        $language->delete();
      }
      $content->delete();
    });
    broadcast(new DataChanged('Content', new ContentResource($this->loadRelationships(Content::query()->withTrashed()->where('id', $content->id)->first(), ['languages']))))->toOthers();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
