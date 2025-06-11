<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Add new columns
            $table->text('description')->nullable();
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->string('google_sheet_url')->nullable();
            $table->date('file_date')->nullable();
            
            // Drop unused columns
            $table->dropColumn([
                'master_inbox_domain',
                'master_inbox_address',
                'master_inbox_password',
                'forward_to_website',
                'registrar_name',
                'registrar_username',
                'registrar_password',
                'sequencer1_name',
                'sequencer1_username',
                'sequencer1_password',
                'sequencer2_name',
                'sequencer2_username',
                'sequencer2_password',
                'warm_up',
                'smartlead_total_warm_up_emails_per_day',
                'smartlead_daily_rampup',
                'randomise_warm_up_emails_per_day',
                'smartlead_reply_rate',
                'smartlead_additional_note',
                'instantly_increase_per_day',
                'instantly_daily_warm_up_limit',
                'instantly_reply_rate',
                'instantly_additional_note'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};