<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\CartService;
use App\Services\MercadoPagoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class CheckoutController extends Controller
{
    public function __construct(
        private CartService $cart,
        private MercadoPagoService $mercadoPago,
    ) {}

    public function show(): Response|RedirectResponse
    {
        $items = $this->cart->items();

        if ($items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Tu carrito está vacío.');
        }

        return Inertia::render('checkout', [
            'items' => $items,
            'total' => $this->cart->total(),
            'configured' => filled(config('mercadopago.access_token')),
        ]);
    }

    public function pay(): RedirectResponse
    {
        $items = $this->cart->items();

        if ($items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Tu carrito está vacío.');
        }

        $order = DB::transaction(function () use ($items) {
            $order = Order::create([
                'user_id' => auth()->id(),
                'total' => $this->cart->total(),
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);

            foreach ($items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'title' => $item->product->title,
                    'description' => $item->product->description,
                    'price' => $item->product->price,
                    'quantity' => $item->quantity,
                ]);
            }

            return $order->load('items');
        });

        try {
            $checkoutUrl = $this->mercadoPago->createCheckoutUrl($order);
        } catch (RuntimeException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        $this->cart->clear();

        return redirect()->away($checkoutUrl);
    }

    public function success(Request $request): Response
    {
        $this->syncFromCallback($request);

        return Inertia::render('payment/success', [
            'order' => $this->orderFromRequest($request),
        ]);
    }

    public function failure(Request $request): Response
    {
        $this->syncFromCallback($request);

        return Inertia::render('payment/failure', [
            'order' => $this->orderFromRequest($request),
        ]);
    }

    public function pending(Request $request): Response
    {
        $this->syncFromCallback($request);

        return Inertia::render('payment/pending', [
            'order' => $this->orderFromRequest($request),
        ]);
    }

    private function syncFromCallback(Request $request): void
    {
        $paymentId = $request->string('payment_id')->toString()
            ?: $request->string('collection_id')->toString();

        if (blank($paymentId) || $paymentId === 'null') {
            return;
        }

        $payment = $this->mercadoPago->fetchPayment($paymentId);

        if (! $payment) {
            return;
        }

        $order = Order::query()->find($payment['external_reference'] ?? $request->string('external_reference'));

        if ($order) {
            $this->mercadoPago->applyPaymentToOrder($order, $payment);
        }
    }

    private function orderFromRequest(Request $request): ?Order
    {
        $orderId = $request->string('external_reference')->toString();

        if (blank($orderId)) {
            return null;
        }

        return Order::query()->with('items')->find($orderId);
    }
}
