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
        Schema::create('department_curriculums', function (Blueprint $table) {
            $table->id();
            $table->string('department_short_name');
            $table->string('curriculum_name')->unique();
            $table->string('program_short_name');

            $table->foreign('program_short_name')
                ->references('program_short_name')
                ->on('program_offerings')
                ->onDelete('cascade');
            $table->foreign('department_short_name')
                ->references('department_short_name')
                ->on('departments')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_curriculums');
    }
};
