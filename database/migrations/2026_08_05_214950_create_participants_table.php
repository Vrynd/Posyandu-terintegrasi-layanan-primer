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
        Schema::create('participants', function (Blueprint $table) {
            $table->id();
            $table->ulid('ulid')->unique();
            $table->string('nik')->nullable();
            $table->string('nik_hash', 64)->unique()->nullable();
            $table->string('name');
            $table->enum('category', ['toddler', 'pregnant_mother', 'teenager', 'productive', 'adult']);
            $table->date('birth_date');
            $table->enum('gender', ['male', 'female']);
            $table->text('address')->nullable();
            $table->string('rt', 5)->nullable();
            $table->string('rw', 5)->nullable();
            $table->string('phone')->nullable();
            $table->boolean('has_bpjs')->default(false);
            $table->text('bpjs_number')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Index performa query
            $table->index('name');
            $table->index('category');
            $table->index('nik_hash');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};
