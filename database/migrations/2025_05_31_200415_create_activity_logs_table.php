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
        Schema::create('credential_activity_logs', function (Blueprint $table) {
            $table->id();

            // The model affected
            $table->unsignedBigInteger('credential_id')->nullable();
            $table->foreign('credential_id')->references('id')->on('credentials')->onDelete('cascade');

            // Actor
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            // Action performed
            $table->string('action'); // e.g., created, updated, deleted

            // Optional: Track what was changed (as JSON or text)
            $table->json('changes')->nullable(); // e.g., {"password": ["old", "new"]}

            // Meta
            $table->string('ip_address')->nullable();
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credential_activity_logs');
    }
};
