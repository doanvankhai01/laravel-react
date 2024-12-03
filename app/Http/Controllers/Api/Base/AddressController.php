<?php

namespace App\Http\Controllers\Api\Base;

use App\Events\DataChanged;
use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreAddressRequest;
use App\Http\Requests\Base\UpdateAddressRequest;
use App\Http\Resources\Base\AddressResource;
use App\Models\Base\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class AddressController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['province', 'district', 'ward', 'user'];
    $this->fullTextSearch = ['address'];
  }

  public static function middleware(): array
  {
    return [
      new Middleware(['auth:sanctum', 'ability:' . ETokenAbility::ACCESS_API->value]),
      new Middleware('throttle:60,1', only: ['store','update','destroy'])
    ];
  }

  /**
   * @OA\Get(path="/api/addresses", tags={"Address"}, summary="Get all address",
   *   description="This request is used to get all address when user use the App. This request is using MySql database.",
   *   @OA\Response( response=200, description="Address fetched",
   *     @OA\JsonContent(@OA\Property(property="message", type="string", example="Get List Success"),
   *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Address")))),
   *   @OA\Response(response=401, description="Protected route need to include sign in token as authorization bearer", @OA\JsonContent(@OA\Property(property="message", type="string", example="Protected route need to include sign in token as authorization bearer"))),
   *   security={{"bearerAuth": {}}}
   * )
   */
  public function index(): AnonymousResourceCollection
  {
    Gate::authorize(EPermissions::P_ADDRESS_INDEX->name);
    $data = $this->filter(Address::query());
    return AddressResource::collection($data['data'])
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreAddressRequest $request): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_STORE->name);
    $data = Address::create([
      ...$request->validated(),
      'user_id' => $request->user()->id,
    ]);
    broadcast(new DataChanged('Address', new AddressResource($this->loadRelationships($data))))->toOthers();
    return response()->json(['message' => __('messages.Create Success'), 'id' => $data['id']], 201);
  }

  /**
   * Display the specified resource.
   */
  public function show(Address $address) : AddressResource
  {
    Gate::authorize(EPermissions::P_ADDRESS_SHOW->name);
    return (new AddressResource($this->loadRelationships($address)))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateAddressRequest $request, Address $address): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_UPDATE->name);
    $address->update($request->validated());
    broadcast(new DataChanged('Address', new AddressResource($this->loadRelationships($address))))->toOthers();
    return response()->json(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Address $address): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_DESTROY->name);
    $address->delete();
    broadcast(new DataChanged('Address', new AddressResource($this->loadRelationships(Address::query()->withTrashed()->where('id', $address->id)->first()))))->toOthers();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
