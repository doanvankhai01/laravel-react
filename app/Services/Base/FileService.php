<?php

namespace App\Services\Base;

use App\Models\Base\File;
use Illuminate\Support\Facades\Storage;

class FileService
{
  public string $defaultAppUrl = 'http://localhost';
  /**
   * @param string|null $value
   * @param bool $isGetAbsolutePath
   * @param callable|null $callback
   * @return string|null
   */
  public function convertSrcImage(?string $value, ?bool $isGetAbsolutePath = false, ?callable $callback = null): string | null
  {
    if ($value) {
      $images = $this->getPathImageHTML($value);
      for ($i = 0; $i < count($images); $i++) {
        $path = $isGetAbsolutePath ? $this->getAbsolutePath($images[$i]) : $this->getRelativePath($images[$i]);
        if ($callback) {
          $callback($path);
        }
        $value = str_replace($images[$i], $path, $value);
      }
    }
    return $value;
  }

  /**
   * @param string|null $value
   * @return array
   */
  public function getSrcImages(?string $value): array
  {
    if ($value) {
      $images = $this->getPathImageHTML($value);
      for ($i = 0; $i < count($images); $i++) {
        $images[$i] = $this->getRelativePath($images[$i]);
      }
      return $images;
    }
    return [];
  }

  /**
   * @param string $path
   * @return void
   */
  public function destroy(string $path): void
  {
    File::query()->where('path', $this->getRelativePath($path))->first()?->delete();
    $this->deleteFile($this->getRelativePath($path));
  }

  /**
   * @param string $path
   * @param bool $active
   * @return void
   */
  public function active(string $path, bool $active): void
  {
    File::query()->where('path', $this->getRelativePath($path))->first()->update(['is_active' => $active]);
  }

  /**
   * @param string $path
   * @return bool
   */
  public function isRelativePath(string $path): bool
  {
    return !str_starts_with($path, env('APP_URL', $this->defaultAppUrl)) && !str_starts_with($path, 'http://') && !str_starts_with($path, 'https://');
  }

  /**
   * @param string $path
   * @return string
   */
  public function getAbsolutePath(string $path): string
  {
    if ($this->isRelativePath($path)) {
      $path = env('APP_URL', $this->defaultAppUrl).':'.env('APP_PORT', '3000').'/storage/' . $path;
    }
    return $path;

  }

  /**
   * @param string $path
   * @return string
   */
  public function getRelativePath(string $path): string
  {
    if (!$this->isRelativePath($path)) {
      $path = str_replace(env('APP_URL', $this->defaultAppUrl) . ':' . env('APP_PORT', '3000') . '/storage/', '', $path);
    }
    return $path;
  }

  /**
   * @param string $path
   * @return void
   */
  public function deleteFile(string $path): void
  {
    if ($this->isRelativePath($path)) {
      Storage::delete($this->getRelativePath($path));
    }
  }

  /**
   * @param string $value
   * @return array
   */
  public function getPathImageHTML(string $value): array
  {
    preg_match_all('/<img src="(.*?)"(.*?)>/s', $value, $matches);
    return array_unique($matches[1]);
  }
}
