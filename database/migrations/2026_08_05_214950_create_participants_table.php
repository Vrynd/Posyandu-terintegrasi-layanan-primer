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
            $table->enum('category', ['balita', 'bumil', 'remaja', 'produktif', 'lansia']);
            $table->date('birth_date');
            $table->enum('gender', ['Laki-Laki', 'Perempuan']);
            $table->text('address')->nullable();
            $table->string('rt', 5)->nullable();
            $table->string('rw', 5)->nullable();
            $table->string('phone')->nullable();
            $table->boolean('has_bpjs')->default(false);
            $table->string('bpjs_number', 20)->nullable();
            $table->timestamps();

            // Index performa query
            $table->index('category');
            $table->index('nik_hash');
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
