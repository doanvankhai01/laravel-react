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
        Schema::create('posts', function (Blueprint $table) {
          $table->engine = 'InnoDB';
          $table->uuid('id');
          $table->string('type_code');
          $table->foreign('type_code')->references('code')->on('post_types')->onDelete('cascade')->onUpdate('cascade');
          $table->string('image_url')->nullable();
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
        Schema::dropIfExists('posts');
    }
};
