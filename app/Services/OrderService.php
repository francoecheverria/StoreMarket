<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(private CartService $cart) {}

    /**
     * @param  Collection<int, CartItem>  $items
     * @param  array{first_name: string, last_name: string, dni: string, address: string, phone: string, email: string}  $customer
     */
    public function place(Collection $items, array $customer): Order
    {
        if ($items->isEmpty()) {
            throw ValidationException::withMessages([
                'cart' => 'Tu carrito está vacío.',
            ]);
        }

        return DB::transaction(function () use ($items, $customer) {
            $orderItems = [];
            $total = 0.0;

            foreach ($items as $item) {
                $product = Product::query()->lockForUpdate()->find($item->product_id);

                if (! $product || $product->stock < $item->quantity) {
                    $title = $product?->title ?? $item->product?->title ?? 'un producto';

                    throw ValidationException::withMessages([
                        'cart' => "No hay stock suficiente de {$title}.",
                    ]);
                }

                $product->decrement('stock', $item->quantity);

                $orderItems[] = [
                    'product_id' => $product->id,
                    'title' => $product->title,
                    'description' => $product->description,
                    'price' => $product->price,
                    'quantity' => $item->quantity,
                ];

                $total += $item->quantity * (float) $product->price;
            }

            $order = Order::create([
                'user_id' => Auth::id(),
                'customer_first_name' => $customer['first_name'],
                'customer_last_name' => $customer['last_name'],
                'customer_dni' => $customer['dni'],
                'customer_address' => $customer['address'],
                'customer_phone' => $customer['phone'],
                'customer_email' => $customer['email'],
                'total' => $total,
                'status' => Order::STATUS_PENDING,
                'payment_status' => 'pending',
                'stock_reserved' => true,
            ]);

            $order->items()->createMany($orderItems);
            $this->cart->clear();

            return $order->load('items');
        });
    }

    public function close(Order $order): void
    {
        $this->assertPending($order);

        $order->update([
            'status' => Order::STATUS_CLOSED,
            'stock_reserved' => false,
        ]);
    }

    public function cancel(Order $order): void
    {
        $this->assertPending($order);

        DB::transaction(function () use ($order) {
            $this->restoreStock($order);

            $order->update([
                'status' => Order::STATUS_CANCELLED,
                'stock_reserved' => false,
            ]);
        });
    }

    public function delete(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $this->restoreStock($order);
            $order->delete();
        });
    }

    private function restoreStock(Order $order): void
    {
        if (! $order->stock_reserved) {
            return;
        }

        $order->loadMissing('items');

        foreach ($order->items as $item) {
            if (! $item->product_id) {
                continue;
            }

            Product::query()->whereKey($item->product_id)->increment('stock', $item->quantity);
        }

        $order->stock_reserved = false;
        $order->save();
    }

    private function assertPending(Order $order): void
    {
        if ($order->isPending()) {
            return;
        }

        throw ValidationException::withMessages([
            'status' => 'Solo se pueden gestionar pedidos pendientes.',
        ]);
    }
}
