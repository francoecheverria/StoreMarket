<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(private CartService $cart) {}

    public function index(): Response
    {
        $items = $this->cart->items();

        return Inertia::render('cart', [
            'items' => $items,
            'total' => $this->cart->total(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $this->cart->add($product, $validated['quantity'] ?? 1);

        return back()->with('success', 'Producto agregado al carrito.');
    }

    public function update(Request $request, CartItem $cartItem): RedirectResponse
    {
        abort_unless($this->cart->owns($cartItem), 403);

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0'],
        ]);

        $this->cart->updateQuantity($cartItem, $validated['quantity']);

        return back();
    }

    public function destroy(CartItem $cartItem): RedirectResponse
    {
        abort_unless($this->cart->owns($cartItem), 403);

        $this->cart->remove($cartItem);

        return back()->with('success', 'Producto eliminado del carrito.');
    }
}
