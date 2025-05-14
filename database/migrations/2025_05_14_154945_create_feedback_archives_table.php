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
        Schema::create('feedback_archives', function (Blueprint $table) {
            $table->id();
            $table->string('sender');
            $table->string('feedback');
            $table->unsignedBigInteger('scheduleID');
            $table->date('version_date');
            $table->string('schedule_name');
            $table->unsignedBigInteger('departmentID');

            $table->foreign('departmentID')->references('departmentID')->on('departments')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback_archives');
    }
};
