<?php

namespace App\Services\Base;

use App\Models\Base\Post;
use App\Models\Base\PostLanguage;
use Illuminate\Support\Facades\DB;

class PostService
{
  /**
   * @param mixed $data
   * @return mixed
   */
  public function save(mixed $data): mixed
  {
    return DB::transaction(function () use ($data) {
      $post = Post::create([...$data]);
      foreach ($data['languages'] as $language) {
        PostLanguage::create([...$language, 'post_id' => $post->id]);
      }
      return $post;
    });
  }

  /**
   * @param mixed $data
   * @param mixed $post
   * @return mixed
   */
  public function update(mixed $data, mixed $post): mixed
  {
    return DB::transaction(function () use ($data, $post) {
      $post->update($data);
      if (isset($data['languages'])) {
        foreach ($data['languages'] as $language) {
          PostLanguage::find($language['id'])->update($language);
        }
      }
      return $post;
    });
  }
}
