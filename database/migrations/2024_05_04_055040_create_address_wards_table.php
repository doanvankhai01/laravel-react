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
        Schema::create('address_wards', function (Blueprint $table) {
          $table->uuid('id');
          $table->string('name');
          $table->string('code')->unique();
          $table->text('description')->nullable();
          $table->string('district_code');
          $table->foreign('district_code')->references('code')->on('address_districts')->onDelete('cascade')->onUpdate('cascade');
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
        Schema::dropIfExists('address_wards');
    }
};
