<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\MercadoPagoService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MercadoPagoWebhookController extends Controller
{
    public function __invoke(Request $request, MercadoPagoService $mercadoPago): Response
    {
        $type = $request->input('type') ?: $request->input('topic');
        $paymentId = data_get($request->all(), 'data.id') ?: $request->input('id');

        if ($type !== 'payment' || blank($paymentId)) {
            return response('ok', 200);
        }

        $payment = $mercadoPago->fetchPayment((string) $paymentId);

        if (! $payment) {
            return response('ok', 200);
        }

        $order = Order::query()->find($payment['external_reference'] ?? null);

        if ($order) {
            $mercadoPago->applyPaymentToOrder($order, $payment);
        }

        return response('ok', 200);
    }
}
