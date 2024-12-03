<?php

namespace App\Http\Controllers\Api\Base;

use App\Events\DataChanged;
use App\Http\Controllers\Controller;
use App\Http\Enums\EPermissions;
use App\Http\Enums\ETokenAbility;
use App\Http\Requests\Base\StoreParameterRequest;
use App\Http\Requests\Base\UpdateParameterRequest;
use App\Http\Resources\Base\ParameterResource;
use App\Models\Base\Parameter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class ParameterController extends Controller implements HasMiddleware
{
  public static function middleware(): array
  {
    return [
      new Middleware(['auth:sanctum', 'ability:' . ETokenAbility::ACCESS_API->value]),
      new Middleware('throttle:60,1', only: ['store','update','destroy'])
    ];
  }
  /**
   * @OA\Get(path="/api/parameters", tags={"Parameter"}, summary="Get all parameter",
   *   description="This request is used to get all parameter when user use the App. This request is using MySql database.",
   *   @OA\Response( response=200, description="Parameter fetched",
   *     @OA\JsonContent(@OA\Property(property="message", type="string", example="Get List Success"),
   *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Parameter")))),
   *   @OA\Response(response=401, description="Protected route need to include sign in token as authorization bearer", @OA\JsonContent(@OA\Property(property="message", type="string", example="Protected route need to include sign in token as authorization bearer"))),
   *   security={{"bearerAuth": {}}}
   * )
   */
  public function index(): AnonymousResourceCollection
  {
    Gate::authorize(EPermissions::P_PARAMETER_INDEX->name);
    $data = $this->filter(Parameter::query());
    return ParameterResource::collection($data['data'])
      ->additional(['message' => __('messages.Get List Success')]);
  }

    /**
     * Store a newly created resource in storage.
     */
  public function store(StoreParameterRequest $request): JsonResponse
  {
    Gate::authorize(EPermissions::P_PARAMETER_STORE->name);
    $data = Parameter::create([...$request->validated()]);
    $data = new ParameterResource($this->loadRelationships($data));
    broadcast(new DataChanged('Parameter', $data))->toOthers();
    return response()->json(['message' => __('messages.Create Success'), 'id' => $data['id']], 201);
  }

  /**
   * Display the specified resource.
   */
  public function show(string $code) : ParameterResource
  {
    Gate::authorize(EPermissions::P_PARAMETER_SHOW->name);
    return (new ParameterResource($this->loadRelationships(Parameter::query()->where('code', $code)->first())))
      ->additional(['message' => __('messages.Get Detail Success')]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateParameterRequest $request, string $code): JsonResponse
  {
    Gate::authorize(EPermissions::P_PARAMETER_UPDATE->name);
    $data = Parameter::query()->where('code', $code)->first();
    $data->update($request->validated());
    broadcast(new DataChanged('Parameter', new ParameterResource($this->loadRelationships($data))))->toOthers();
    return response()->json(['message' => __('messages.Update Success')]);

  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $code): JsonResponse
  {
    Gate::authorize(EPermissions::P_PARAMETER_DESTROY->name);
    Parameter::query()->where('code', $code)->delete();
    broadcast(new DataChanged('Parameter', new ParameterResource($this->loadRelationships(Parameter::query()->withTrashed()->where('code', $code)->first()))))->toOthers();
    return response()->json(['message' => __('messages.Delete Success')]);
  }
}
