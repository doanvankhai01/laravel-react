<?php

namespace App\Http\Controllers\Api\Base;

use App\Events\DataChanged;
use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreContentTypeRequest;
use App\Http\Requests\Base\UpdateContentTypeRequest;
use App\Http\Resources\Base\ContentTypeResource;
use App\Models\Base\ContentType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class ContentTypeController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['contents'];
    $this->fullTextSearch = ['name', 'code', 'description'];
  }
  public static function middleware(): array
  {
    return [
      new Middleware(['auth:sanctum', 'ability:' . ETokenAbility::ACCESS_API->value]),
      new Middleware('throttle:60,1', only: ['store','update','destroy'])
    ];
  }
  /**
   * @OA\Get(path="/api/contents/types", tags={"ContentType"}, summary="Get all content type",
   *   description="This request is used to get all content type when user use the App. This request is using MySql database.",
   *   @OA\Response( response=200, description="Content type fetched",
   *     @OA\JsonContent(@OA\Property(property="message", type="string", example="Get List Success"),
   *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/ContentType")))),
   *   @OA\Response(response=401, description="Protected route need to include sign in token as authorization bearer", @OA\JsonContent(@OA\Property(property="message", type="string", example="Protected route need to include sign in token as authorization bearer"))),
   *   security={{"bearerAuth": {}}}
   * )
   */
  public function index(): AnonymousResourceCollection
  {
    Gate::authorize(EPermissions::P_CONTENT_TYPE_INDEX->name);
    $data = $this->filter(ContentType::query());
    return ContentTypeResource::collection($data['data'])
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreContentTypeRequest $request): JsonResponse
  {
    Gate::authorize(EPermissions::P_CONTENT_TYPE_STORE->name);
    $data = ContentType::create([...$request->validated()]);
    broadcast(new DataChanged('ContentType', new ContentTypeResource($this->loadRelationships($data))))->toOthers();
    return response()->json(['message' => __('messages.Create Success'), 'id' => $data['id']], 201);
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code): ContentTypeResource
  {
    Gate::authorize(EPermissions::P_CONTENT_TYPE_SHOW->name);
    return (new ContentTypeResource($this->loadRelationships(ContentType::query()->where('code', $code)->first())))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateContentTypeRequest $request, string $code): JsonResponse
  {
    Gate::authorize(EPermissions::P_CONTENT_TYPE_UPDATE->name);
    $data = ContentType::query()->where('code', $code)->first();
    $data->update($request->validated());
    broadcast(new DataChanged('ContentType', new ContentTypeResource($this->loadRelationships($data))))->toOthers();
    return response()->json(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    Gate::authorize(EPermissions::P_CONTENT_TYPE_DESTROY->name);
    ContentType::query()->where('code', $code)->first()->delete();
    broadcast(new DataChanged('ContentType', new ContentTypeResource($this->loadRelationships(ContentType::query()->withTrashed()->where('code', $code)->first()))))->toOthers();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
