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
       Schema::create('credentials', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('username');
        $table->string('password');
        $table->integer('assigned')->nullable();
        $table->integer('available');
        $table->string('status');
        $table->string('category');
        $table->string('remarks')->nullable();
        $table->string('description')->nullable();
        $table->string('organization_name')->nullable();
        $table->string('label'); // e.g., "Cloudflare", "Google Panel"

        // ✅ Foreign key to clients
        $table->unsignedBigInteger('client_id')->nullable();
        $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');

        // Record-keeping
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('deleted_by')->references('id')->on('users')->onDelete('cascade');

            $table->string('ip_address')->nullable();

            $table->softDeletes();
            $table->timestamps();
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credentials');
    }
};
