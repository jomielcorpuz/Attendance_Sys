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
       Schema::create('worksheets', function (Blueprint $table) {
        $table->id();
        $table->string('worksheet_name');
        $table->foreignId('client_id')->constrained();
        $table->foreignId('cloudflare_credential_id')->nullable()->constrained('credentials');
        $table->foreignId('googlepanel_credential_id')->nullable()->constrained('credentials');
        $table->integer('no_of_domains')->default(0);
        $table->integer('no_of_users_per_domain')->default(0);
        $table->integer('total_users')->default(0);
        $table->string('workspace')->nullable();
        $table->string('tag')->nullable();
        $table->string('sheet_link')->nullable();
        $table->timestamp('timestamp_cdt')->nullable();

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
        Schema::dropIfExists('worksheets');
    }
};
