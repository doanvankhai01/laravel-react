<?php

namespace App\Http\Controllers\Api\Base;

use App\Events\DataChanged;
use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreCodeRequest;
use App\Http\Requests\Base\UpdateCodeRequest;
use App\Http\Resources\Base\CodeResource;
use App\Models\Base\Code;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class CodeController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['type'];
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
   * @OA\Get(path="/api/codes", tags={"Code"}, summary="Get all code",
   *   description="This request is used to get all code when user use the App. This request is using MySql database.",
   *   @OA\Response( response=200, description="Code fetched",
   *     @OA\JsonContent(@OA\Property(property="message", type="string", example="Get List Success"),
   *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Code")))),
   *   @OA\Response(response=401, description="Protected route need to include sign in token as authorization bearer", @OA\JsonContent(@OA\Property(property="message", type="string", example="Protected route need to include sign in token as authorization bearer"))),
   *   security={{"bearerAuth": {}}}
   * )
   */
    public function index(): AnonymousResourceCollection
    {
      Gate::authorize(EPermissions::P_CODE_INDEX->name);
      $data = $this->filter(Code::query());
      return CodeResource::collection($data['data'])
        ->additional(['message' => __('messages.Get List Success')]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCodeRequest $request): JsonResponse
    {
      Gate::authorize(EPermissions::P_CODE_STORE->name);
      $data = Code::create([...$request->validated()]);
      broadcast(new DataChanged('Code', new CodeResource($this->loadRelationships($data))))->toOthers();
      return response()->json(['message' => __('messages.Create Success'), 'id' => $data['id']], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code) : CodeResource
    {
      Gate::authorize(EPermissions::P_CODE_SHOW->name);
      return (new CodeResource($this->loadRelationships(Code::query()->where('code', $code)->first())))
        ->additional(['message' => __('messages.Get Detail Success')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCodeRequest $request, string $code): JsonResponse
    {
      Gate::authorize(EPermissions::P_CODE_UPDATE->name);
      $data = Code::query()->where('code', $code)->first();
      $data->update($request->validated());
      broadcast(new DataChanged('Code', new CodeResource($this->loadRelationships($data))))->toOthers();
      return response()->json(['message' => __('messages.Update Success')]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code): JsonResponse
    {
      Gate::authorize(EPermissions::P_CODE_DESTROY->name);
      Code::query()->where('code', $code)->delete();
      broadcast(new DataChanged('Code', new CodeResource($this->loadRelationships(Code::query()->withTrashed()->where('code', $code)->first()))))->toOthers();
      return response()->json(['message' => __('messages.Delete Success')]);
    }
}
