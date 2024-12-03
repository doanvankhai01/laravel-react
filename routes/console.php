<?php

use App\Models\Base\File;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Storage;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();
Schedule::call(function () {
  $files = File::where('is_active', false)->get();
  $files->each(function ($file) {
    Storage::delete($file->path);
    File::findOrFail($file->id)->delete();
  });
})->daily();
