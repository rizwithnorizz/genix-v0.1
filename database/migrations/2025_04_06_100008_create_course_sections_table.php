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
            $table->string('program_short_name');
            $table->integer('year_level');
            $table->string('curriculum_name');

            $table->foreign('program_short_name')
                ->references('program_short_name')
                ->on('program_offerings')
                ->onDelete('cascade');
            $table->foreign('curriculum_name')
                ->references('curriculum_name')
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
