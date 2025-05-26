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
        Schema::create('domains_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('domain_id')->constrained();
            $table->string('email_pattern'); // e.g., cristian@, cristian.f@
            $table->string('full_name')->nullable();
            $table->string('profile_link')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domains_users');
    }
};
