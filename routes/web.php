<?php

use App\Models\Base\Post;
use Illuminate\Support\Facades\Route;

//Route::get('/', function () {
//  $posts = Post::query()->with(['languages','type'])->get();
//  $redis = \Illuminate\Support\Facades\Redis::connection();
//  $redis::set('posts', json_encode($posts));
//  return view('home', compact("posts"));
//});
Route::get('/', function () {
//  $posts = Post::query()->with(['languages','type'])->get();
//  \Illuminate\Support\Facades\Redis::set('posts', json_encode($posts));
  $posts = \Illuminate\Support\Facades\Cache::rememberForever('posts', function () {
    return Post::query()->with(['languages','type'])->get();
  });
  return view('home', compact("posts"));
});

Route::get('/administrator', fn () => view('administrator'));
