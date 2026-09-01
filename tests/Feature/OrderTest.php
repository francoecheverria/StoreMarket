<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        $this->disableCookieEncryption();
        config(['store.whatsapp.number' => '5491112345678']);
    }

    public function test_guest_can_view_checkout_with_cart_items(): void
    {
        $product = $this->createProduct(stock: 5);

        $this->addToCart($product, 2);

        $this->get(route('checkout.show'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('checkout')
                ->has('items', 1)
                ->where('total', fn ($total) => (float) $total === 200.0)
            );
    }

    public function test_guest_can_place_an_order_and_stock_is_reserved(): void
    {
        $product = $this->createProduct(stock: 5);

        $this->addToCart($product, 2);

        $response = $this->post(route('checkout.store'), $this->customerPayload());

        $order = Order::query()->first();

        $this->assertNotNull($order);
        $response->assertRedirect(route('orders.confirmation', $order));
        $this->assertSame(3, $product->fresh()->stock);
        $this->assertSame(Order::STATUS_PENDING, $order->status);
        $this->assertTrue($order->stock_reserved);
        $this->assertSame('Ana', $order->customer_first_name);
        $this->assertSame('Pérez', $order->customer_last_name);
        $this->assertSame('32123456', $order->customer_dni);
        $this->assertDatabaseCount('cart_items', 0);

        $this->get(route('orders.confirmation', $order))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('orders/confirmation')
                ->where('order.id', $order->id)
                ->where('whatsappUrl', fn ($url) => is_string($url) && str_contains($url, 'wa.me/5491112345678'))
            );
    }

    public function test_checkout_requires_customer_data(): void
    {
        $product = $this->createProduct();

        $this->addToCart($product);

        $this->post(route('checkout.store'), [])
            ->assertSessionHasErrors(['first_name', 'last_name', 'dni', 'address', 'phone', 'email']);
    }

    public function test_cannot_place_order_when_stock_is_insufficient(): void
    {
        $product = $this->createProduct(stock: 2);

        $this->addToCart($product, 2);

        $product->update(['stock' => 1]);

        $this->post(route('checkout.store'), $this->customerPayload())
            ->assertSessionHasErrors('cart');

        $this->assertDatabaseCount('orders', 0);
        $this->assertSame(1, $product->fresh()->stock);
    }

    public function test_cannot_add_more_items_than_stock_to_cart(): void
    {
        $product = $this->createProduct(stock: 1);

        $this->post(route('cart.store'), [
            'product_id' => $product->id,
            'quantity' => 2,
        ])->assertSessionHasErrors('quantity');

        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_admin_can_close_a_pending_order_without_restoring_stock(): void
    {
        $product = $this->createProduct(stock: 4);
        $order = $this->placeOrder($product, 2);

        $this->actingAs(User::factory()->admin()->create())
            ->post(route('admin.orders.close', $order))
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertSame(Order::STATUS_CLOSED, $order->fresh()->status);
        $this->assertFalse($order->fresh()->stock_reserved);
        $this->assertSame(2, $product->fresh()->stock);
    }

    public function test_admin_can_cancel_a_pending_order_and_stock_is_restored(): void
    {
        $product = $this->createProduct(stock: 4);
        $order = $this->placeOrder($product, 2);

        $this->actingAs(User::factory()->admin()->create())
            ->post(route('admin.orders.cancel', $order))
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertSame(Order::STATUS_CANCELLED, $order->fresh()->status);
        $this->assertFalse($order->fresh()->stock_reserved);
        $this->assertSame(4, $product->fresh()->stock);
    }

    public function test_cancelling_twice_does_not_restore_stock_again(): void
    {
        $product = $this->createProduct(stock: 4);
        $order = $this->placeOrder($product, 2);
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post(route('admin.orders.cancel', $order));
        $this->actingAs($admin)
            ->post(route('admin.orders.cancel', $order))
            ->assertSessionHasErrors('status');

        $this->assertSame(4, $product->fresh()->stock);
    }

    public function test_admin_order_includes_whatsapp_link_to_customer(): void
    {
        $product = $this->createProduct();
        $order = $this->placeOrder($product);

        $this->actingAs(User::factory()->admin()->create())
            ->get(route('admin.orders.show', $order))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/orders/show')
                ->where('order.customer_phone', '1155551234')
                ->where('order.customer_whatsapp_url', fn ($url) => is_string($url) && str_contains($url, 'wa.me/5491155551234'))
            );
    }

    public function test_deleting_a_pending_order_restores_stock(): void
    {
        $product = $this->createProduct(stock: 4);
        $order = $this->placeOrder($product, 2);

        $this->actingAs(User::factory()->admin()->create())
            ->delete(route('admin.orders.destroy', $order))
            ->assertRedirect(route('admin.orders.index'));

        $this->assertDatabaseCount('orders', 0);
        $this->assertSame(4, $product->fresh()->stock);
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function createProduct(int $stock = 5, array $overrides = []): Product
    {
        $category = Category::query()->create([
            'name' => 'Cuidado facial',
            'slug' => 'cuidado-facial-'.uniqid(),
        ]);

        return Product::query()->create([
            'category_id' => $category->id,
            'title' => 'Sérum Glow',
            'description' => 'Sérum de prueba.',
            'price' => 100,
            'stock' => $stock,
            ...$overrides,
        ]);
    }

    private function addToCart(Product $product, int $quantity = 1): void
    {
        $this->post(route('cart.store'), [
            'product_id' => $product->id,
            'quantity' => $quantity,
        ])->assertRedirect();
    }

    private function placeOrder(Product $product, int $quantity = 1): Order
    {
        $this->addToCart($product, $quantity);
        $this->post(route('checkout.store'), $this->customerPayload())->assertRedirect();

        return Order::query()->firstOrFail();
    }

    /**
     * @return array<string, string>
     */
    private function customerPayload(): array
    {
        return [
            'first_name' => 'Ana',
            'last_name' => 'Pérez',
            'dni' => '32123456',
            'address' => 'Av. Siempre Viva 742',
            'phone' => '1155551234',
            'email' => 'ana@example.com',
        ];
    }
}
