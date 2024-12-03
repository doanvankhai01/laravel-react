<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('post_languages', function (Blueprint $table) {
          $table->uuid('id');
          $table->string('language');
          $table->string('name');
          $table->string('slug');
          $table->text('description')->nullable();
          $table->longText('content')->nullable();
          $table->foreignUuid('post_id');
            $table->timestamps();
          $table->softDeletes();
          $table->timestamp('disabled_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_languages');
    }
};
