<?php

use App\Enums\ScheduleStatus;
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
        Schema::create('activity_schedules', function (Blueprint $table) {
            $table->id();
            $table->ulid('ulid')->unique();
            $table->string('title');
            $table->string('activity_type', 100)->nullable();
            $table->date('date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('location');
            $table->text('description')->nullable();
            $table->enum('status', array_column(ScheduleStatus::cases(), 'value'))
                ->default(ScheduleStatus::Scheduled->value);
            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();
            $table->timestamps();

            // Index query performa
            $table->index('date');
            $table->index('status');
            $table->index(['status', 'date']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_schedules');
    }
};
