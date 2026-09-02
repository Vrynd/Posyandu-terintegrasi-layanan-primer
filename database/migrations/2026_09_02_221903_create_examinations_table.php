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
        Schema::create('examinations', function (Blueprint $table) {
            $table->id();
            $table->ulid('ulid')->unique();
            $table->foreignId('participant_id')->constrained('participants')->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->date('examination_date');
            $table->decimal('weight', 5, 2)->nullable();
            $table->boolean('is_referred')->default(false);
            $table->enum('location', ['health_post', 'home_visit'])->default('health_post');
            $table->timestamps();

            // Index query performa
            $table->index('examination_date');
            $table->index('participant_id');
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examinations');
    }
};
