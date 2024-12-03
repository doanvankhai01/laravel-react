<?php

namespace App\Services\Base;

use App\Models\Base\Content;
use App\Models\Base\ContentLanguage;
use Illuminate\Support\Facades\DB;

class ContentService
{
  /**
   * @param mixed $data
   * @return mixed
   */
  public function save(mixed $data): mixed
  {
    return DB::transaction(function () use ($data) {
      $content = Content::create([...$data]);
      foreach ($data['languages'] as $language) {
        ContentLanguage::create([...$language, 'content_id' => $content->id]);
      }
      return $content;
    });
  }

  /**
   * @param mixed $data
   * @param mixed $content
   * @return mixed
   */
  public function update(mixed $data, mixed $content): mixed
  {
    return DB::transaction(function () use ($data, $content) {
      $content->update($data);
      if (isset($data['languages'])) {
        foreach ($data['languages'] as $language) {
          ContentLanguage::find($language['id'])->update($language);
        }
      }
      return $content;
    });
  }
}
