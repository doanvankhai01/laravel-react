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
        Schema::create('address_districts', function (Blueprint $table) {
          $table->uuid('id');
          $table->string('name');
          $table->string('code')->unique();
          $table->text('description')->nullable();
          $table->string('province_code');
          $table->foreign('province_code')->references('code')->on('address_provinces')->onDelete('cascade')->onUpdate('cascade');
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
        Schema::dropIfExists('address_districts');
    }
};
