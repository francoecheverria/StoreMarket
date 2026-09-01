<?php

use App\Http\Controllers\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MercadoPagoWebhookController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/productos/{product}', [ProductController::class, 'show'])->name('products.show');

Route::middleware('auth')->get('/dashboard', function () {
    return auth()->user()?->is_admin
        ? redirect()->route('admin.dashboard')
        : redirect()->route('home');
})->name('dashboard');

Route::get('/carrito', [CartController::class, 'index'])->name('cart.index');
Route::post('/carrito', [CartController::class, 'store'])->name('cart.store');
Route::patch('/carrito/{cartItem}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/carrito/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');

Route::get('/contacto', [ContactController::class, 'create'])->name('contact.create');
Route::post('/contacto', [ContactController::class, 'store'])->name('contact.store');

Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout.show');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/pedido/{order}/confirmado', [CheckoutController::class, 'confirmation'])->name('orders.confirmation');

Route::post('/webhooks/mercadopago', MercadoPagoWebhookController::class)->name('webhooks.mercadopago');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', AdminDashboardController::class)->name('dashboard');
    Route::get('banners', [AdminBannerController::class, 'edit'])->name('banners.edit');
    Route::post('banners', [AdminBannerController::class, 'update'])->name('banners.update');
    Route::resource('products', AdminProductController::class)->except(['show']);
    Route::resource('categories', AdminCategoryController::class)->except(['show']);
    Route::resource('orders', AdminOrderController::class)->only(['index', 'show', 'destroy']);
    Route::post('orders/{order}/cerrar', [AdminOrderController::class, 'close'])->name('orders.close');
    Route::post('orders/{order}/cancelar', [AdminOrderController::class, 'cancel'])->name('orders.cancel');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
