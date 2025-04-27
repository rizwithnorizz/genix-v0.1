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
        Schema::create('course_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_name')->unique();
            $table->unsignedBigInteger('programID');
            $table->integer('year_level');
            $table->unsignedBigInteger('curriculumID');

            $table->foreign('programID')
                ->references('id')
                ->on('program_offerings')
                ->onDelete('cascade');
            $table->foreign('curriculumID')
                ->references('id')
                ->on('department_curriculums')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_sections');
    }
};
