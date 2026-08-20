<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class MercadoPagoService
{
    public function createCheckoutUrl(Order $order): string
    {
        $token = config('mercadopago.access_token');

        if (blank($token)) {
            throw new RuntimeException('Falta configurar MERCADOPAGO_ACCESS_TOKEN en el archivo .env.');
        }

        $items = $order->items->map(fn ($item) => [
            'title' => $item->title,
            'description' => $item->description,
            'quantity' => (int) $item->quantity,
            'currency_id' => 'ARS',
            'unit_price' => (float) $item->price,
        ])->values()->all();

            $payload = [
                'items' => $items,
                'external_reference' => (string) $order->id,
                'binary_mode' => false,
                'statement_descriptor' => 'GlowMarket',
                'payment_methods' => [
                    'installments' => 12,
                    'default_installments' => 1,
                ],
                'back_urls' => [
                    'success' => route('payment.success'),
                    'failure' => route('payment.failure'),
                    'pending' => route('payment.pending'),
                ],
                'auto_return' => 'approved',
                'metadata' => [
                    'order_id' => $order->id,
                ],
            ];

            if (str_starts_with((string) config('app.url'), 'https://')) {
                $payload['notification_url'] = route('webhooks.mercadopago');
            }

            $response = Http::withToken($token)
                ->acceptJson()
                ->post('https://api.mercadopago.com/checkout/preferences', $payload);

        if ($response->failed()) {
            throw new RuntimeException($response->json('message') ?: 'No se pudo crear el pago en Mercado Pago.');
        }

        $order->update([
            'mp_preference_id' => $response->json('id'),
        ]);

        return $response->json('init_point') ?: $response->json('sandbox_init_point');
    }

    public function fetchPayment(string $paymentId): ?array
    {
        $token = config('mercadopago.access_token');

        if (blank($token) || blank($paymentId)) {
            return null;
        }

        $response = Http::withToken($token)
            ->acceptJson()
            ->get("https://api.mercadopago.com/v1/payments/{$paymentId}");

        if ($response->failed()) {
            return null;
        }

        return $response->json();
    }

    public function applyPaymentToOrder(Order $order, array $payment): void
    {
        $status = $payment['status'] ?? 'pending';
        $method = $payment['payment_type_id'] ?? $payment['payment_method_id'] ?? null;

        $order->update([
            'mp_payment_id' => (string) ($payment['id'] ?? $order->mp_payment_id),
            'payment_status' => $status,
            'payment_method' => $method,
            'status' => $status === 'approved' ? 'paid' : ($status === 'rejected' ? 'cancelled' : 'pending'),
        ]);
    }
}
