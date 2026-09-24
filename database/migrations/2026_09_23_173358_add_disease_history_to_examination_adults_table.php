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
        Schema::table('examination_adults', function (Blueprint $table) {
            $table->json('family_disease_history')->nullable()->after('high_fat_intake');
            $table->json('personal_disease_history')->nullable()->after('family_disease_history');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('examination_adults', function (Blueprint $table) {
            $table->dropColumn(['family_disease_history', 'personal_disease_history']);
        });
    }
};
