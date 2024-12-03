<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Carbon\Carbon;
use Illuminate\Support\Str;
/**
 * @OA\Info(
 *   description="This is a sample Laravel server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).",
 *   version="1.0.0",
 *   title="Swagger Laravel",
 *   termsOfService="http://swagger.io/terms/",
 *   @OA\Contact(email="apiteam@swagger.io"),
 *   @OA\License(name="Apache 2.0", url="http://www.apache.org/licenses/LICENSE-2.0.html")
 * )
 * @OA\Tag(name="Address", description="Operations about address")
 * @OA\Tag(name="AddressProvince", description="Operations about address province")
 * @OA\Tag(name="AddressDistrict", description="Operations about address district")
 * @OA\Tag(name="AddressWard", description="Operations about address ward")
 * @OA\Tag(name="Code", description="Operations about code")
 * @OA\Tag(name="CodeType", description="Operations about code type")
 * @OA\Tag(name="Content", description="Operations about content")
 * @OA\Tag(name="ContentType", description="Operations about content type")
 * @OA\Tag(name="Parameter", description="Operations about parameter")
 * @OA\Tag(name="Post", description="Operations about post")
 * @OA\Tag(name="PostType", description="Operations about post type")
 * @OA\Tag(name="User", description="Operations about user")
 * @OA\Tag(name="UserRole", description="Operations about user role")
 * @OA\Server(description="Localhost API Mocking", url="http://localhost:3000")
 * @OA\SecurityScheme(
 *   securityScheme="bearerAuth",
 *   type="http",
 *   scheme="bearer",
 *   bearerFormat="JWT",
 *   description="JWT Authorization header using the Bearer scheme."
 * )
 */
abstract class Controller
{
  public array $relations = [];
  public array $fullTextSearch = [];
  public function loadRelationships(
    Model|QueryBuilder|EloquentBuilder $for, ?array $relations = null
  ) : Model|QueryBuilder|EloquentBuilder
  {
    $array = $relations ?? $this->relations ?? [];
    foreach ($array as $relation) {
      $for->when($relations != null || $this->shouldIncludeRelation($relation),
        fn($q) => $for instanceof Model ? $for->load($relation) : $q->with($relation)
      );
    }
    return $for;
  }
  protected function shouldIncludeRelation(string $relation): bool
  {
    $include = \request()->query('include');
    if (!$include) {
      return false;
    }
    $relations = array_map('trim', explode(',', $include));
    return in_array($relation, $relations);
  }

  public function filter(Model|QueryBuilder|EloquentBuilder $for, ?bool $isSoftDelete = true,?array $relations = null): array
  {
    $this->selectColumnsByQuery($for);
    $this->filterByQueryFullTextSearch($for);
    $this->filterByQueryString($for);
    $this->extendByQueryString($for);
    $this->sortByQuery($for);
    $this->loadRelationships($for, $relations);
    $this->getNewData($for);
    if ($isSoftDelete) $for->withTrashed();
    return [
      "data" => $for->get(),
    ];
  }

  protected function getNewData(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $latestUpdated = \request()->query('latestUpdated');
    if ($latestUpdated) {
      $for->whereDate('updated_at', '>',$latestUpdated)      ;
    }
    return $for;
  }

  protected function selectColumnsByQuery(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $select = \request()->query('select');
    if ($select) {
      $select = array_map(fn ($item) => Str::snake(trim($item)), explode(',', $select));
      $for->select(...$select);
    }
    return $for;
  }

  protected function filterByQueryFullTextSearch(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $value = \request()->query('fullTextSearch');
    if ($this->fullTextSearch && $value) {
      $for->where(function ($query) use ($value) {
        $array = [];
        foreach ($this->fullTextSearch as $key) {
          $keys = array_map('trim', explode('.', $key));
          if (count($keys) > 1) {
            $array[$keys[0]][] = $keys[1];
          } else {
            $query->orWhere(Str::snake($key), 'like', "%$value%");
          }
        }
        foreach ($array as $key => $names) {
          $query->whereHas(Str::snake($key), function ($q) use ($names, $value){
            foreach ($names as $name) {
              $q->where(Str::snake($name), 'like', "%$value%");
            }
          });
        }
      });
    }
    return $for;
  }

  protected function filterByQueryString(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $filters = ['select', 'sort', 'include','pageIndex','pageSize','fullTextSearch', 'extend', 'latestUpdated'];
    $queries = \request()->query();
    if ($queries) {
      foreach ($queries as $key => $value) {
        if (!in_array($key, $filters)) {
          $keys = array_map('trim', explode('.', $key));
          if (count($keys) > 1) {
            $for->whereHas(Str::snake($keys[0]), function ($q) use ($value, $keys){
              if (is_array($value)){
                if (count($value) === 2 && strtotime($value[0]) && strtotime($value[1])) {
                  $q->whereBetween(Str::snake($keys[1]), $value);
                } else $q->whereIn(Str::snake($keys[1]), $value);
              } else $q->where(Str::snake($keys[1]), 'like', "%$value%");
            });
          } else {
            if (is_array($value)){
              if (count($value) === 2 && strtotime($value[0]) && strtotime($value[1])) {
                $for->whereBetween(Str::snake($key), $value);
              } else $for->whereIn(Str::snake($key), $value);
            } else $for->where(Str::snake($key), $value);
          }
        }
      }
    }
    return $for;
  }

  protected function extendByQueryString(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $extends = \request()->query('extend');
    if ($extends) {
      foreach ($extends as $extend) {
        $extend = array_map('trim', explode(',', $extend));
        $keys = array_map('trim', explode('.', $extend[0]));
        if (count($keys) > 1) {
          $for->whereHas(Str::snake($keys[0]), function ($q) use ($extend, $keys){
            $q->orWhere(Str::snake($keys[1]), $extend[1]);
          });
        } else {
          $for->orWhere(Str::snake($extend[0]), $extend[1]);
        }
      }
    }
    return $for;
  }

  protected function sortByQuery(Model|QueryBuilder|EloquentBuilder $for) : Model|QueryBuilder|EloquentBuilder
  {
    $sort = \request()->query('sort');
    if ($sort) {
      $sort = array_map('trim', explode(',', $sort));
      $keys = array_map('trim', explode('.', $sort[0]));
      if (count($keys) > 1) {
        $for->whereHas(Str::snake($keys[0]), function ($q) use ($sort, $keys){
          $q->orderBy(Str::snake($keys[1]), $sort[1]);
        });
      } else {
        $for->orderBy(Str::snake($sort[0]), $sort[1]);
      }
    } else {
      $for->orderBy('updated_at', 'desc');
    }
    return $for;
  }

}
