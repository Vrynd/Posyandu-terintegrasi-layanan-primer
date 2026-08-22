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
        // Kategori Ibu Hamil
        Schema::create('pregnancies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_id')
                ->constrained('participants')
                ->cascadeOnDelete();

            $table->string('husband_name')->nullable();
            $table->smallInteger('pregnancy_number')->nullable();
            $table->smallInteger('birth_spacing_years')->nullable();
            $table->decimal('weight_before_pregnancy', 5, 2)->nullable();
            $table->decimal('height', 5, 2)->nullable();
            $table->date('last_menstrual_period')->nullable();
            $table->enum('status', ['active', 'completed', 'miscarried'])->default('active');
            $table->timestamps();

            $table->index('participant_id');
        });

        // Kategori Balita
        Schema::create('participant_toddlers', function (Blueprint $table) {
            $table->foreignId('participant_id')
                ->primary()
                ->constrained('participants')
                ->cascadeOnDelete();

            $table->string('parent_name')->nullable();
            $table->timestamps();
        });

        // Kategori Usia Remaja
        Schema::create('participant_teens', function (Blueprint $table) {
            $table->foreignId('participant_id')
                ->primary()
                ->constrained('participants')
                ->cascadeOnDelete();

            $table->string('parent_name')->nullable();
            $table->timestamps();
        });

        // Kategori Usia Produktif dan Lansia
        Schema::create('participant_adults', function (Blueprint $table) {
            $table->foreignId('participant_id')
                ->primary()
                ->constrained('participants')
                ->cascadeOnDelete();

            $table->enum('employment', [
                'farmer',
                'farm_laborer',
                'civil_servant',
                'private_employee',
                'entrepreneur',
                'fisherman',
                'housewife',
                'unemployed_new',
                'unemployed',
                'other',
            ])->nullable();
            $table->string('employment_other')->nullable();
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pregnancies');
        Schema::dropIfExists('participant_toddlers');
        Schema::dropIfExists('participant_teens');
        Schema::dropIfExists('participant_adults');
    }
};
