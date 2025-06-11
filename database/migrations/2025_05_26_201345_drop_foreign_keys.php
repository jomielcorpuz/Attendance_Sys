<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendance_logs', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);
            $table->dropForeign(['logged_by']);
            $table->dropForeign(['approved_by']);
        });
    }

    public function down(): void
    {
        Schema::table('attendance_logs', function (Blueprint $table) {
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('logged_by')->references('id')->on('employees')->nullOnDelete();
            $table->foreign('approved_by')->references('id')->on('employees')->nullOnDelete();
        });
    }
};