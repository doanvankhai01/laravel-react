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
        Schema::create('addresses', function (Blueprint $table) {
          $table->uuid('id');
          $table->string('address');
          $table->string('province_code');
          $table->foreign('province_code')->references('code')->on('address_provinces')->onDelete('cascade')->onUpdate('cascade');
          $table->string('district_code');
          $table->foreign('district_code')->references('code')->on('address_districts')->onDelete('cascade')->onUpdate('cascade');
          $table->string('ward_code');
          $table->foreign('ward_code')->references('code')->on('address_wards')->onDelete('cascade')->onUpdate('cascade');
          $table->foreignUuid('user_id');
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
        Schema::dropIfExists('addresses');
    }
};
