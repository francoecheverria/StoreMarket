<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'products' => Product::count(),
                'categories' => Category::count(),
                'banners' => Banner::count(),
                'orders' => Order::count(),
                'pendingOrders' => Order::query()->where('status', 'pending')->count(),
            ],
        ]);
    }
}
