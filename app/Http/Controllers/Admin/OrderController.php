<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(private OrderService $orders) {}

    public function index(): Response
    {
        return Inertia::render('admin/orders/index', [
            'orders' => Order::query()->with(['user', 'items'])->latest()->get(),
        ]);
    }

    public function show(Order $order): Response
    {
        return Inertia::render('admin/orders/show', [
            'order' => $order->load(['user', 'items']),
        ]);
    }

    public function close(Order $order): RedirectResponse
    {
        $this->orders->close($order);

        return back()->with('success', 'Pedido cerrado.');
    }

    public function cancel(Order $order): RedirectResponse
    {
        $this->orders->cancel($order);

        return back()->with('success', 'Pedido cancelado. El stock fue renovado.');
    }

    public function destroy(Order $order): RedirectResponse
    {
        $this->orders->delete($order);

        return redirect()->route('admin.orders.index')->with('success', 'Pedido eliminado.');
    }
}
