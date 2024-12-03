<?php

namespace App\Http\Controllers\Api\Base;

use App\Events\DataChanged;
use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreCodeTypeRequest;
use App\Http\Requests\Base\UpdateCodeTypeRequest;
use App\Http\Resources\Base\CodeTypeResource;
use App\Models\Base\CodeType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class CodeTypeController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['codes'];
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
   * @OA\Get(path="/api/codes/types", tags={"CodeType"}, summary="Get all code type",
   *   description="This request is used to get all code type when user use the App. This request is using MySql database.",
   *   @OA\Response( response=200, description="Code type fetched",
   *     @OA\JsonContent(@OA\Property(property="message", type="string", example="Get List Success"),
   *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/CodeType")))),
   *   @OA\Response(response=401, description="Protected route need to include sign in token as authorization bearer", @OA\JsonContent(@OA\Property(property="message", type="string", example="Protected route need to include sign in token as authorization bearer"))),
   *   security={{"bearerAuth": {}}}
   * )
   */
    public function index(): AnonymousResourceCollection
    {
      Gate::authorize(EPermissions::P_CODE_TYPE_INDEX->name);
      $data = $this->filter(CodeType::query());
        return CodeTypeResource::collection($data['data'])
          ->additional(['message' => __('messages.Get List Success')]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCodeTypeRequest $request): JsonResponse
    {
      Gate::authorize(EPermissions::P_CODE_TYPE_STORE->name);
      $data = CodeType::create([...$request->validated()]);
      broadcast(new DataChanged('CodeType', new CodeTypeResource($this->loadRelationships($data))))->toOthers();
      return response()->json(['message' => __('messages.Create Success'), 'id' => $data['id']], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code): CodeTypeResource
    {
      Gate::authorize(EPermissions::P_CODE_TYPE_SHOW->name);
      return (new CodeTypeResource($this->loadRelationships(CodeType::query()->where('code', $code)->first())))
        ->additional(['message' => __('messages.Get Detail Success')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCodeTypeRequest $request, string $code): JsonResponse
    {
      Gate::authorize(EPermissions::P_CODE_TYPE_UPDATE->name);
      $data = CodeType::query()->where('code', $code)->first();
      $data->update($request->validated());
      broadcast(new DataChanged('CodeType', new CodeTypeResource($this->loadRelationships($data))))->toOthers();
      return response()->json(['message' => __('messages.Update Success')]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code): JsonResponse
    {
      Gate::authorize(EPermissions::P_CODE_TYPE_DESTROY->name);
      CodeType::query()->where('code', $code)->first()->delete();
      broadcast(new DataChanged('CodeType', new CodeTypeResource($this->loadRelationships(CodeType::query()->withTrashed()->where('code', $code)->first()))))->toOthers();
      return response()->json(['message' => __('messages.Delete Success')]);
    }
}
