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
        Schema::create('credential_worksheet', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('credential_id');
            $table->unsignedBigInteger('worksheet_id');

            $table->foreign('credential_id')->references('id')->on('credentials')->onDelete('cascade');
            $table->foreign('worksheet_id')->references('id')->on('worksheets')->onDelete('cascade');

            $table->timestamps();

            $table->unique(['credential_id', 'worksheet_id']); // prevent duplicates
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credential_worksheet');
    }
};
