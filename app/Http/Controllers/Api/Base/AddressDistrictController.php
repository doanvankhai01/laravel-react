<?php

namespace App\Http\Controllers\Api\Base;

use App\Events\DataChanged;
use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreAddressDistrictRequest;
use App\Http\Requests\Base\UpdateAddressDistrictRequest;
use App\Http\Resources\Base\AddressDistrictResource;
use App\Models\Base\AddressDistrict;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class AddressDistrictController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['wards', 'province'];
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
   * @OA\Get(path="/api/addresses/districts", tags={"AddressDistrict"}, summary="Get all address district",
   *   description="This request is used to get all address district when user use the App. This request is using MySql database.",
   *   @OA\Response( response=200, description="Address district fetched",
   *     @OA\JsonContent(@OA\Property(property="message", type="string", example="Get List Success"),
   *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/AddressDistrict")))),
   *   @OA\Response(response=401, description="Protected route need to include sign in token as authorization bearer", @OA\JsonContent(@OA\Property(property="message", type="string", example="Protected route need to include sign in token as authorization bearer"))),
   *   security={{"bearerAuth": {}}}
   * )
   */
  public function index(): AnonymousResourceCollection
  {
    Gate::authorize(EPermissions::P_ADDRESS_DISTRICT_INDEX->name);
    $data = $this->filter(AddressDistrict::query());
    return AddressDistrictResource::collection($data['data'])
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreAddressDistrictRequest $request): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_DISTRICT_STORE->name);
    $data = AddressDistrict::create([...$request->validated()]);
    broadcast(new DataChanged('AddressDistrict', new AddressDistrictResource($this->loadRelationships($data))))->toOthers();
    return response()->json(['message' => __('messages.Create Success'), 'id' => $data['id']], 201);
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code): AddressDistrictResource
  {
    Gate::authorize(EPermissions::P_ADDRESS_DISTRICT_SHOW->name);
    return (new AddressDistrictResource($this->loadRelationships(AddressDistrict::query()->where('code', $code)->first())))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateAddressDistrictRequest $request, string $code): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_DISTRICT_UPDATE->name);
    $data = AddressDistrict::query()->where('code', $code)->first();
    $data->update($request->validated());
    broadcast(new DataChanged('AddressDistrict', new AddressDistrictResource($this->loadRelationships($data))))->toOthers();
    return response()->json(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_DISTRICT_DESTROY->name);
    AddressDistrict::query()->where('code', $code)->first()->delete();
    broadcast(new DataChanged('AddressDistrict', new AddressDistrictResource($this->loadRelationships(AddressDistrict::query()->withTrashed()->where('code', $code)->first()))))->toOthers();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
