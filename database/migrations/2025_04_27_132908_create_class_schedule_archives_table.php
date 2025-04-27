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
        Schema::create('class_schedule_archives', function (Blueprint $table) {
            $table->id();
            $table->json('schedule');
            $table->string('repo_name');
            $table->unsignedBigInteger('departmentID');
            $table->string('semester');
            $table->boolean('status')->default(false);
            $table->foreign('departmentID')
                ->references('departmentID')
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
        Schema::dropIfExists('class_schedule_archives');
    }
};
