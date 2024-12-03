<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class FrontendCaseMiddleware
{
  public const CASE_SNAKE = 'snake';
  public const CASE_CAMEL = 'camel';

  /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
      $request->replace(
        $this->convertKeysToCase(
          self::CASE_SNAKE,
          $request->post()
        )
      );
      $response = $next($request);
      if ($response instanceof JsonResponse) {
        $response->setData(
          $this->convertKeysToCase(
            self::CASE_CAMEL,
            json_decode($response->content(), true)
          )
        );
      }
      return $response;
    }

  private function convertKeysToCase(string $case, array $data) : array
  {
    if (!is_array($data)) {
      return $data;
    }

    $array = [];

    foreach ($data as $key => $value) {
      $array[Str::{$case}($key)] = is_array($value)
        ? $this->convertKeysToCase($case, $value)
        : $value;
    }

    return $array;
  }
}
