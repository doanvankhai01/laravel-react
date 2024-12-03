<?php

use App\Http\Enums\ETokenAbility;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [\App\Http\Controllers\Api\Base\AuthController::class, 'login']);
Route::post('/auth/logout', [\App\Http\Controllers\Api\Base\AuthController::class, 'logout']);
Route::post('/auth/register', [\App\Http\Controllers\Api\Base\AuthController::class, 'register']);
Route::post('/auth/forgotten-password', [\App\Http\Controllers\Api\Base\AuthController::class, 'forgottenPassword']);
Route::get('/auth/profile', [\App\Http\Controllers\Api\Base\AuthController::class, 'profile']);
Route::put('/auth/profile', [\App\Http\Controllers\Api\Base\AuthController::class, 'update']);
Route::get('/auth/refresh-token', [\App\Http\Controllers\Api\Base\AuthController::class, 'refreshToken'])->middleware('auth:sanctum', 'ability:' . ETokenAbility::ISSUE_ACCESS_TOKEN->value);

Route::apiResource('users/roles', \App\Http\Controllers\Api\Base\UserRoleController::class);
Route::apiResource('users', \App\Http\Controllers\Api\Base\UserController::class);
Route::apiResource('files', \App\Http\Controllers\Api\Base\FileController::class);
Route::apiResource('parameters', \App\Http\Controllers\Api\Base\ParameterController::class);

Route::apiResource('codes/types', \App\Http\Controllers\Api\Base\CodeTypeController::class);
Route::apiResource('codes', \App\Http\Controllers\Api\Base\CodeController::class);

Route::apiResource('contents/types', \App\Http\Controllers\Api\Base\ContentTypeController::class);
Route::get('contents/valid', [\App\Http\Controllers\Api\Base\ContentTypeController::class, 'valid']);
Route::apiResource('contents', \App\Http\Controllers\Api\Base\ContentController::class);

Route::apiResource('posts/types', \App\Http\Controllers\Api\Base\PostTypeController::class);
Route::get('posts/valid', [\App\Http\Controllers\Api\Base\PostController::class, 'valid']);
Route::apiResource('posts', \App\Http\Controllers\Api\Base\PostController::class);

Route::apiResource('addresses/provinces', \App\Http\Controllers\Api\Base\AddressProvinceController::class);
Route::apiResource('addresses/districts', \App\Http\Controllers\Api\Base\AddressDistrictController::class);
Route::apiResource('addresses/wards', \App\Http\Controllers\Api\Base\AddressWardController::class);
Route::apiResource('addresses', \App\Http\Controllers\Api\Base\AddressController::class);
