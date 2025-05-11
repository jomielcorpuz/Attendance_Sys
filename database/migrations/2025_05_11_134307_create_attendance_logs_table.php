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
        Schema::create('attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->timestamp('clock_in');
            $table->timestamp('clock_out')->nullable();
            $table->enum('status', ['IN', 'OUT', 'EARLY_OUT', 'OVERTIME'])->default('IN');
            $table->decimal('gross_hours', 5, 2)->nullable();
            $table->integer('break_minutes')->default(0);
            $table->decimal('rendered_hours', 5, 2)->nullable();
            $table->decimal('earned_amount', 10, 2)->nullable();
            $table->foreignId('logged_by')->nullable()->constrained('employees')->nullOnDelete();
            $table->text('notes')->nullable();

            // Approval
            $table->boolean('is_approved')->default(false);
            $table->foreignId('approved_by')->nullable()->constrained('employees')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();


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
        Schema::dropIfExists('attendance_logs');
    }
};
