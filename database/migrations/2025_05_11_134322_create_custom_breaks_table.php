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
        Schema::create('custom_breaks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attendance_log_id')->constrained()->onDelete('cascade');
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->integer('duration_minutes');
            $table->string('reason')->nullable();

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
        Schema::dropIfExists('custom_breaks');
    }
};
