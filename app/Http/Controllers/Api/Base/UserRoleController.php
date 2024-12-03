<?php

namespace App\Http\Controllers\Api\Base;

use App\Events\DataChanged;
use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreUserRoleRequest;
use App\Http\Requests\Base\UpdateRoleUserRequest;
use App\Http\Resources\Base\UserRoleResource;
use App\Models\Base\UserRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class UserRoleController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['users'];
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
   * @OA\Get(path="/api/users/roles", tags={"UserRole"}, summary="Get all user role",
   *   description="This request is used to get all user role when user use the App. This request is using MySql database.",
   *   @OA\Response( response=200, description="User role fetched",
   *     @OA\JsonContent(@OA\Property(property="message", type="string", example="Get List Success"),
   *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/UserRole")))),
   *   @OA\Response(response=401, description="Protected route need to include sign in token as authorization bearer", @OA\JsonContent(@OA\Property(property="message", type="string", example="Protected route need to include sign in token as authorization bearer"))),
   *   security={{"bearerAuth": {}}}
   * )
   */
  public function index(): AnonymousResourceCollection
  {
    Gate::authorize(EPermissions::P_USER_ROLE_INDEX->name);
    $data = $this->filter(UserRole::query());
    return UserRoleResource::collection($data['data'])
      ->additional(['message' => __('messages.Get List Success')]);
  }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRoleRequest $request): JsonResponse
    {
      Gate::authorize(EPermissions::P_USER_ROLE_STORE->name);
      $data = UserRole::create([...$request->validated()]);
      broadcast(new DataChanged('UserRole', new UserRoleResource($this->loadRelationships($data))))->toOthers();
      return response()->json(['message' => __('messages.Create Success'), 'id' => $data['id']], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code): UserRoleResource
    {
      Gate::authorize(EPermissions::P_USER_ROLE_SHOW->name);
      return (new UserRoleResource($this->loadRelationships(UserRole::query()->where('code', $code)->first())))
        ->additional(['message' => __('messages.Get Detail Success')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleUserRequest $request, string $code): JsonResponse
    {
      Gate::authorize(EPermissions::P_USER_ROLE_UPDATE->name);
      $data = UserRole::query()->where('code', $code)->first();
      $data->update($request->validated());
      broadcast(new DataChanged('UserRole', new UserRoleResource($this->loadRelationships($data))))->toOthers();
      return response()->json(['message' => __('messages.Update Success')]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code): JsonResponse
    {
      Gate::authorize(EPermissions::P_USER_ROLE_DESTROY->name);
      UserRole::query()->where('code', $code)->first()->delete();
      broadcast(new DataChanged('UserRole', new UserRoleResource($this->loadRelationships(UserRole::query()->withTrashed()->where('code', $code)->first()))))->toOthers();
      return response()->json(['message' => __('messages.Delete Success')]);
    }
}
