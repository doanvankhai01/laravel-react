<?php

namespace App\Http\Controllers\Api\Base;

use App\Events\DataChanged;
use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreUserRequest;
use App\Http\Requests\Base\UpdateUserRequest;
use App\Http\Resources\Base\UserResource;
use App\Models\Base\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['role', 'position'];
    $this->fullTextSearch = ['name', 'email', 'phone_number'];
  }

  public static function middleware(): array
  {
    return [
      new Middleware(['auth:sanctum', 'ability:' . ETokenAbility::ACCESS_API->value]),
      new Middleware('throttle:60,1', only: ['store','update','destroy'])
    ];
  }
  /**
   * @OA\Get(path="/api/users", tags={"User"}, summary="Get all user",
   *   description="This request is used to get all user when user use the App. This request is using MySql database.",
   *   @OA\Response( response=200, description="User fetched",
   *     @OA\JsonContent(@OA\Property(property="message", type="string", example="Get List Success"),
   *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/User")))),
   *   @OA\Response(response=401, description="Protected route need to include sign in token as authorization bearer", @OA\JsonContent(@OA\Property(property="message", type="string", example="Protected route need to include sign in token as authorization bearer"))),
   *   security={{"bearerAuth": {}}}
   * )
   */
  public function index(): AnonymousResourceCollection
  {
    Gate::authorize(EPermissions::P_USER_INDEX->name);
    $data = $this->filter(User::query());
    return UserResource::collection($data['data'])
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreUserRequest $request): JsonResponse
  {
    Gate::authorize(EPermissions::P_USER_STORE->name);
    $data = User::create($request->validated());
    broadcast(new DataChanged('User', new UserResource($this->loadRelationships($data, ['position']))))->toOthers();
    return response()->json(['message' => __('messages.Create Success'), 'id' => $data['id']], 201);
  }

  /**
   * Display the specified resource.
   */
  public function show(User $user): UserResource
  {
    Gate::authorize(EPermissions::P_USER_SHOW->name);
    return (new UserResource($this->loadRelationships($user)))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateUserRequest $request, User $user): JsonResponse
  {
    Gate::authorize(EPermissions::P_USER_UPDATE->name);
    $user->update($request->validated());
    broadcast(new DataChanged('User', new UserResource($this->loadRelationships($user, ['position']))))->toOthers();
    return response()->json(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(User $user): JsonResponse
  {
    Gate::authorize(EPermissions::P_USER_DESTROY->name);
    $user->delete();
    broadcast(new DataChanged('User', new UserResource($this->loadRelationships(User::query()->withTrashed()->where('id', $user->id)->first(), ['position']))))->toOthers();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
