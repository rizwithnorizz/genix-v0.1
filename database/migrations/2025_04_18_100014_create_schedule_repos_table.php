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
        Schema::create('schedule_repos', function (Blueprint $table) {
            $table->id();
            $table->json('schedule');
            $table->string('repo_name');
            $table->string('department_short_name');
            $table->string('semester');
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
        Schema::dropIfExists('schedule_repos');
    }
};
