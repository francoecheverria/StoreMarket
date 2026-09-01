<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Services\CartService;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private CartService $cart,
        private OrderService $orders,
    ) {}

    public function show(): Response|RedirectResponse
    {
        $items = $this->cart->items();

        if ($items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Tu carrito está vacío.');
        }

        $user = auth()->user();

        return Inertia::render('checkout', [
            'items' => $items,
            'total' => $this->cart->total(),
            'defaults' => [
                'first_name' => $user?->name ?? '',
                'email' => $user?->email ?? '',
            ],
        ]);
    }

    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $items = $this->cart->items();

        if ($items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Tu carrito está vacío.');
        }

        $order = $this->orders->place($items, $request->validated());

        $request->session()->put('checkout_order_id', $order->id);

        return redirect()
            ->route('orders.confirmation', $order)
            ->with('success', 'Pedido realizado. Tus productos quedaron reservados.');
    }

    public function confirmation(Order $order): Response
    {
        abort_unless((int) session('checkout_order_id') === $order->id, 403);

        $order->load('items');

        return Inertia::render('orders/confirmation', [
            'order' => $order,
            'whatsappUrl' => $order->storeWhatsappUrl(),
        ]);
    }
}
