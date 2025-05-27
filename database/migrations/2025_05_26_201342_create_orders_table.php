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
        Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->foreignId('client_id')->constrained();
        $table->string('order_name');
        $table->string('website_url')->nullable();

        $table->string('master_inbox_domain')->nullable();
        $table->string('master_inbox_address')->nullable();
        $table->string('master_inbox_password')->nullable();
        $table->string('forward_to_website')->nullable();

        $table->string('registrar_name')->nullable();
        $table->string('registrar_username')->nullable();
        $table->string('registrar_password')->nullable();

        $table->string('sequencer1_name')->nullable();
        $table->string('sequencer1_username')->nullable();
        $table->string('sequencer1_password')->nullable();

        $table->string('sequencer2_name')->nullable();
        $table->string('sequencer2_username')->nullable();
        $table->string('sequencer2_password')->nullable();

        // Smartlead warm-up
        $table->boolean('warm_up')->default(false);
        $table->integer('smartlead_total_warm_up_emails_per_day')->nullable();
        $table->integer('smartlead_daily_rampup')->nullable();
        $table->boolean('randomise_warm_up_emails_per_day')->default(false);
        $table->decimal('smartlead_reply_rate', 5, 2)->nullable();
        $table->text('smartlead_additional_note')->nullable();

        // Instantly warm-up
        $table->integer('instantly_increase_per_day')->nullable();
        $table->integer('instantly_daily_warm_up_limit')->nullable();
        $table->decimal('instantly_reply_rate', 5, 2)->nullable();
        $table->text('instantly_additional_note')->nullable();

        $table->text('additional_note')->nullable();

        $table->timestamps();
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
