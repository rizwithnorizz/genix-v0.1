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
        Schema::create('instructor_feedback', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('instructor_id')->unsigned();
            $table->unsignedBigInteger('subjectID');
            $table->unsignedBigInteger('departmentID');
            $table->boolean('status')->nullable();
            $table->string('feedback');
            $table->unsignedBigInteger('scheduleID');
            $table->timestamps();

            $table->foreign('scheduleID')->references('id')->on('schedules')->onDelete('cascade');
            $table->foreign('departmentID')->references('departmentID')->on('departments')->onDelete('cascade');
            $table->foreign('instructor_id')->references('id')->on('instructors')->onDelete('cascade');
            $table->foreign('subjectID')->references('id')->on('subjects')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instructor_feedback');
    }
};
