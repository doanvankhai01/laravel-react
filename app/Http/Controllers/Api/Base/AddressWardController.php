<?php

namespace App\Http\Controllers\Api\Base;

use App\Events\DataChanged;
use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreAddressWardRequest;
use App\Http\Requests\Base\UpdateAddressWardRequest;
use App\Http\Resources\Base\AddressWardResource;
use App\Models\Base\AddressWard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class AddressWardController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['district'];
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
   * @OA\Get(path="/api/addresses/wards", tags={"AddressWard"}, summary="Get all address ward",
   *   description="This request is used to get all address ward when user use the App. This request is using MySql database.",
   *   @OA\Response( response=200, description="Address ward fetched",
   *     @OA\JsonContent(@OA\Property(property="message", type="string", example="Get List Success"),
   *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/AddressWard")))),
   *   @OA\Response(response=401, description="Protected route need to include sign in token as authorization bearer", @OA\JsonContent(@OA\Property(property="message", type="string", example="Protected route need to include sign in token as authorization bearer"))),
   *   security={{"bearerAuth": {}}}
   * )
   */
  public function index(): AnonymousResourceCollection
  {
    Gate::authorize(EPermissions::P_ADDRESS_WARD_INDEX->name);
    $data = $this->filter(AddressWard::query());
    return AddressWardResource::collection($data['data'])
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreAddressWardRequest $request): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_WARD_STORE->name);
    $data = AddressWard::create([...$request->validated()]);
    broadcast(new DataChanged('AddressDistrict', new AddressWardResource($this->loadRelationships($data))))->toOthers();
    return response()->json(['message' => __('messages.Create Success'), 'id' => $data['id']], 201);
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code): AddressWardResource
  {
    Gate::authorize(EPermissions::P_ADDRESS_WARD_SHOW->name);
    return (new AddressWardResource($this->loadRelationships(AddressWard::query()->where('code', $code)->first())))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateAddressWardRequest $request, string $code): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_WARD_UPDATE->name);
    $data = AddressWard::query()->where('code', $code)->first();
    $data->update($request->validated());
    broadcast(new DataChanged('AddressWard', new AddressWardResource($this->loadRelationships($data))))->toOthers();
    return response()->json(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_WARD_DESTROY->name);
    AddressWard::query()->where('code', $code)->first()->delete();
    broadcast(new DataChanged('AddressWard', new AddressWardResource($this->loadRelationships(AddressWard::query()->withTrashed()->where('code', $code)->first()))))->toOthers();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
