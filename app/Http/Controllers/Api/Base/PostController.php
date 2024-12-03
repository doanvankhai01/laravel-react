<?php

namespace App\Http\Controllers\Api\Base;

use App\Events\DataChanged;
use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StorePostRequest;
use App\Http\Requests\Base\UpdatePostRequest;
use App\Http\Resources\Base\PostResource;
use App\Models\Base\Post;
use App\Models\Base\PostLanguage;
use App\Services\Base\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller implements HasMiddleware
{
  protected PostService $postService;
  public function __construct(PostService $postService)
  {
    $this->relations = ['type', 'languages'];
    $this->fullTextSearch = ['languages.name', 'languages.slug', 'languages.description'];
    $this->postService = $postService;
  }

  public static function middleware(): array
  {
    return [
      new Middleware(['auth:sanctum', 'ability:' . ETokenAbility::ACCESS_API->value]),
      new Middleware('throttle:60,1', only: ['store','update','destroy'])
    ];
  }
  /**
   * @OA\Get(path="/api/posts", tags={"Post"}, summary="Get all post",
   *   description="This request is used to get all post when user use the App. This request is using MySql database.",
   *   @OA\Response( response=200, description="Post fetched",
   *     @OA\JsonContent(@OA\Property(property="message", type="string", example="Get List Success"),
   *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Post")))),
   *   @OA\Response(response=401, description="Protected route need to include sign in token as authorization bearer", @OA\JsonContent(@OA\Property(property="message", type="string", example="Protected route need to include sign in token as authorization bearer"))),
   *   security={{"bearerAuth": {}}}
   * )
   */
  public function index(): AnonymousResourceCollection
  {
    Gate::authorize(EPermissions::P_POST_INDEX->name);
    $data = $this->filter(Post::query());
    return PostResource::collection($data['data'])
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Validation in database.
   */
  public function valid(): JsonResponse
  {
    Gate::authorize(EPermissions::P_POST_INDEX->name);
    $name = \request()->query('name');
    $value = \request()->query('value');
    $id = \request()->query('id');

    if (!isset($name) || !isset($value)  || (!isset($id) && PostLanguage::where($name, $value)->exists()) || (isset($id) && PostLanguage::where($name, $value)->where('post_id', '!=', $id)->exists())) {
      return response()->json(['data' => true]);
    }
    return response()->json(['data' => false]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StorePostRequest $request): JsonResponse
  {
    Gate::authorize(EPermissions::P_POST_STORE->name);
    $data = $this->postService->save($request->validated());
    broadcast(new DataChanged('Post', new PostResource($this->loadRelationships($data, ['languages']))))->toOthers();
    return response()->json(['message' => __('messages.Create Success'), 'id' => $data['id']], 201);
  }

  /**
   * Display the specified resource.
   */
  public function show(Post $post) : PostResource
  {
    Gate::authorize(EPermissions::P_POST_SHOW->name);
    return (new PostResource($this->loadRelationships($post)))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdatePostRequest $request, Post $post): JsonResponse
  {
    Gate::authorize(EPermissions::P_POST_UPDATE->name);
    $this->postService->update($request->validated(), $post);
    broadcast(new DataChanged('Post', new PostResource($this->loadRelationships($post, ['languages']))))->toOthers();
    return response()->json(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Post $post): JsonResponse
  {
    Gate::authorize(EPermissions::P_POST_DESTROY->name);

    DB::transaction(function () use ($post) {
      $languages = PostLanguage::where('post_id', $post->id)->get();
      foreach ($languages as $language) {
        $language->delete();
      }
      $post->delete();
    });
    broadcast(new DataChanged('Post', new PostResource($this->loadRelationships(Post::query()->withTrashed()->where('id', $post->id)->first(), ['languages']))))->toOthers();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}

