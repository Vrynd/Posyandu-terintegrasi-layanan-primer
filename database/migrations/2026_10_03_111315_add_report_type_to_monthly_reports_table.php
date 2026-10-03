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
        Schema::table('monthly_reports', function (Blueprint $table) {
            $table->dropUnique(['year', 'month']);
            $table->string('report_type', 30)->after('month')->default('examination');
            $table->unique(['year', 'month', 'report_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('monthly_reports', function (Blueprint $table) {
            $table->dropUnique(['year', 'month', 'report_type']);
            $table->dropColumn('report_type');
            $table->unique(['year', 'month']);
        });
    }
};
