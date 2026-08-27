<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn('price');
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->renameColumn('title', 'name');
            $table->renameColumn('description', 'message');
        });
    }

    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->renameColumn('name', 'title');
            $table->renameColumn('message', 'description');
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->decimal('price', 12, 2)->nullable();
        });
    }
};
