<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CartService
{
    public function items(): Collection
    {
        return $this->baseQuery()->with(['product.category', 'product.images'])->get();
    }

    public function count(): int
    {
        return (int) $this->baseQuery()->sum('quantity');
    }

    public function add(Product $product, int $quantity = 1): CartItem
    {
        $item = $this->baseQuery()->where('product_id', $product->id)->first();
        $newQuantity = ($item?->quantity ?? 0) + $quantity;

        $this->assertStock($product, $newQuantity);

        if ($item) {
            $item->increment('quantity', $quantity);

            return $item->fresh('product');
        }

        return CartItem::create([
            'user_id' => Auth::id(),
            'session_id' => Auth::check() ? null : $this->guestToken(),
            'product_id' => $product->id,
            'quantity' => $quantity,
        ]);
    }

    public function updateQuantity(CartItem $item, int $quantity): void
    {
        if ($quantity < 1) {
            $item->delete();

            return;
        }

        $item->loadMissing('product');
        $this->assertStock($item->product, $quantity);

        $item->update(['quantity' => $quantity]);
    }

    public function remove(CartItem $item): void
    {
        $item->delete();
    }

    public function clear(): void
    {
        $this->baseQuery()->delete();
    }

    public function owns(CartItem $item): bool
    {
        if (Auth::check()) {
            return $item->user_id === Auth::id();
        }

        return $item->session_id === $this->guestToken();
    }

    public function mergeGuestCart(?string $sessionId, User $user): void
    {
        $tokens = array_values(array_filter([
            $sessionId,
            session('cart_token'),
        ]));

        if ($tokens === []) {
            return;
        }

        $guestItems = CartItem::query()
            ->whereNull('user_id')
            ->whereIn('session_id', $tokens)
            ->get();

        foreach ($guestItems as $guestItem) {
            $existing = CartItem::query()
                ->where('user_id', $user->id)
                ->where('product_id', $guestItem->product_id)
                ->first();

            if ($existing) {
                $existing->increment('quantity', $guestItem->quantity);
                $guestItem->delete();

                continue;
            }

            $guestItem->update([
                'user_id' => $user->id,
                'session_id' => null,
            ]);
        }
    }

    public function total(): float
    {
        return (float) $this->items()->sum(fn (CartItem $item) => $item->quantity * (float) $item->product->price);
    }

    private function assertStock(Product $product, int $quantity): void
    {
        if ($product->stock >= $quantity) {
            return;
        }

        $message = $product->stock < 1
            ? "{$product->title} no tiene stock disponible."
            : "Solo hay {$product->stock} unidad(es) de {$product->title}.";

        throw ValidationException::withMessages([
            'quantity' => $message,
        ]);
    }

    private function guestToken(): string
    {
        $token = session('cart_token');

        if (! is_string($token) || $token === '') {
            $token = (string) Str::uuid();
            session()->put('cart_token', $token);
        }

        return $token;
    }

    private function baseQuery()
    {
        $query = CartItem::query();

        if (Auth::check()) {
            return $query->where('user_id', Auth::id());
        }

        return $query->where('session_id', $this->guestToken())->whereNull('user_id');
    }
}
