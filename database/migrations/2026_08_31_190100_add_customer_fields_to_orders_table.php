<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_first_name')->nullable()->after('user_id');
            $table->string('customer_last_name')->nullable()->after('customer_first_name');
            $table->string('customer_dni')->nullable()->after('customer_last_name');
            $table->string('customer_address')->nullable()->after('customer_dni');
            $table->string('customer_phone')->nullable()->after('customer_address');
            $table->string('customer_email')->nullable()->after('customer_phone');
            $table->boolean('stock_reserved')->default(false)->after('payment_method');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'customer_first_name',
                'customer_last_name',
                'customer_dni',
                'customer_address',
                'customer_phone',
                'customer_email',
                'stock_reserved',
            ]);
        });
    }
};
