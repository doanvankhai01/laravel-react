<?php

namespace App\Http\Controllers\Api\Base;

use App\Events\DataChanged;
use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreAddressProvinceRequest;
use App\Http\Requests\Base\UpdateAddressProvinceRequest;
use App\Http\Resources\Base\AddressProvinceResource;
use App\Models\Base\AddressProvince;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class AddressProvinceController extends Controller implements HasMiddleware
{
  public function __construct()
  {
    $this->relations = ['districts'];
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
   * @OA\Get(path="/api/addresses/provinces", tags={"AddressProvince"}, summary="Get all address province",
   *   description="This request is used to get all address province when user use the App. This request is using MySql database.",
   *   @OA\Response( response=200, description="Address province fetched",
   *     @OA\JsonContent(@OA\Property(property="message", type="string", example="Get List Success"),
   *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/AddressProvince")))),
   *   @OA\Response(response=401, description="Protected route need to include sign in token as authorization bearer", @OA\JsonContent(@OA\Property(property="message", type="string", example="Protected route need to include sign in token as authorization bearer"))),
   *   security={{"bearerAuth": {}}}
   * )
   */
  public function index(): AnonymousResourceCollection
  {
    Gate::authorize(EPermissions::P_ADDRESS_PROVINCE_INDEX->name);
    $data = $this->filter(AddressProvince::query());
    return AddressProvinceResource::collection($data['data'])
      ->additional(['message' => __('messages.Get List Success')]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreAddressProvinceRequest $request): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_PROVINCE_STORE->name);
    $data = AddressProvince::create([...$request->validated()]);
    broadcast(new DataChanged('AddressProvince', new AddressProvinceResource($this->loadRelationships($data))))->toOthers();
    return response()->json(['message' => __('messages.Create Success'), 'id' => $data['id']], 201);
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code): AddressProvinceResource
  {
    Gate::authorize(EPermissions::P_ADDRESS_PROVINCE_SHOW->name);
    return (new AddressProvinceResource($this->loadRelationships(AddressProvince::query()->where('code', $code)->first())))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateAddressProvinceRequest $request, string $code): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_PROVINCE_UPDATE->name);
    $data = AddressProvince::query()->where('code', $code)->first();
    $data->update($request->validated());
    broadcast(new DataChanged('AddressProvince', new AddressProvinceResource($this->loadRelationships($data))))->toOthers();
    return response()->json(['message' => __('messages.Update Success')]);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    Gate::authorize(EPermissions::P_ADDRESS_PROVINCE_DESTROY->name);
    AddressProvince::query()->where('code', $code)->first()->delete();
    broadcast(new DataChanged('AddressProvince', new AddressProvinceResource($this->loadRelationships(AddressProvince::query()->withTrashed()->where('code', $code)->first()))))->toOthers();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
