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
        Schema::table('examination_teens', function (Blueprint $table) {
            $table->json('family_disease_history')->nullable()->after('bmi_category');
            $table->json('risk_behaviors')->nullable()->after('family_disease_history');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('examination_teens', function (Blueprint $table) {
            $table->dropColumn(['family_disease_history', 'risk_behaviors']);
        });
    }
};
