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
        Schema::create('examination_toddlers', function (Blueprint $table) {
            $table->foreignId('examination_id')
                ->primary()
                ->constrained('examinations')
                ->cascadeOnDelete();
            $table->unsignedSmallInteger('age_in_months')->nullable();
            $table->enum('weight_status', ['increased', 'decreased', 'same', 'below_red_line'])->nullable(); // N-T-BGM
            $table->decimal('height', 5, 2)->nullable();
            $table->decimal('head_circumference', 5, 2)->nullable();
            $table->decimal('arm_circumference', 5, 2)->nullable();
            $table->boolean('has_illness_symptoms')->default(false);
            $table->json('interventions')->nullable();
            $table->timestamps();
        });

        Schema::create('examination_pregnant_mothers', function (Blueprint $table) {
            $table->foreignId('examination_id')
                ->primary()
                ->constrained('examinations')
                ->cascadeOnDelete();
            $table->foreignId('pregnancy_id')
                ->nullable()
                ->constrained('pregnancies')
                ->nullOnDelete();
            $table->unsignedSmallInteger('gestational_age_weeks')->nullable();
            $table->decimal('upper_arm_circumference', 5, 2)->nullable();
            $table->unsignedSmallInteger('systolic_pressure')->nullable();
            $table->unsignedSmallInteger('diastolic_pressure')->nullable();
            $table->boolean('has_iron_tablets')->default(false);
            $table->boolean('exclusive_breastfeeding_counseling')->default(false);
            $table->boolean('receives_pmt_kek')->default(false);
            $table->boolean('attends_prenatal_class')->default(false);
            $table->timestamps();
            $table->index('pregnancy_id');
        });

        Schema::create('examination_teens', function (Blueprint $table) {
            $table->foreignId('examination_id')
                ->primary()
                ->constrained('examinations')
                ->cascadeOnDelete();
            $table->decimal('height', 5, 2)->nullable();
            $table->decimal('abdominal_circumference', 5, 2)->nullable();
            $table->unsignedSmallInteger('systolic_pressure')->nullable();
            $table->unsignedSmallInteger('diastolic_pressure')->nullable();
            $table->decimal('blood_sugar', 5, 2)->nullable();
            $table->string('hemoglobin', 20)->nullable();
            $table->enum('bmi_category', ['severely_underweight', 'underweight', 'normal', 'overweight', 'obese'])->nullable();
            $table->json('mental_screenings')->nullable();
            $table->timestamps();
        });

        Schema::create('examination_adults', function (Blueprint $table) {
            $table->foreignId('examination_id')
                ->primary()
                ->constrained('examinations')
                ->cascadeOnDelete();
            $table->decimal('height', 5, 2)->nullable();
            $table->decimal('abdominal_circumference', 5, 2)->nullable();
            $table->unsignedSmallInteger('systolic_pressure')->nullable();
            $table->unsignedSmallInteger('diastolic_pressure')->nullable();
            $table->decimal('blood_sugar', 5, 2)->nullable();
            $table->decimal('uric_acid', 5, 2)->nullable();
            $table->decimal('cholesterol', 5, 2)->nullable();
            $table->enum('eye_test', ['normal', 'impaired'])->nullable();
            $table->enum('ear_test', ['normal', 'impaired'])->nullable();
            $table->string('contraceptive', 50)->nullable();
            $table->enum('bmi_category', ['severely_underweight', 'underweight', 'normal', 'overweight', 'obese'])->nullable();
            $table->boolean('is_smoking')->default(false);
            $table->boolean('high_sugar_intake')->default(false);
            $table->boolean('high_salt_intake')->default(false);
            $table->boolean('high_fat_intake')->default(false);
            $table->unsignedSmallInteger('puma_score')->nullable();
            $table->unsignedSmallInteger('adl_score')->nullable();
            $table->enum('independence_level', ['independent', 'mild', 'moderate', 'severe', 'total'])->nullable();
            $table->json('puma_screenings')->nullable();
            $table->json('adl_screenings')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examination_adults');
        Schema::dropIfExists('examination_teens');
        Schema::dropIfExists('examination_pregnant_mothers');
        Schema::dropIfExists('examination_toddlers');
    }
};
