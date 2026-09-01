<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductShowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        config(['store.whatsapp.number' => null]);
    }

    public function test_product_detail_page_can_be_rendered(): void
    {
        $category = Category::query()->create([
            'name' => 'Cuidado facial',
            'slug' => 'cuidado-facial',
        ]);

        $product = Product::query()->create([
            'category_id' => $category->id,
            'title' => 'Sérum Glow Vitamin C',
            'description' => 'Sérum antioxidante para iluminar la piel.',
            'price' => 18990,
        ]);

        $this->get(route('products.show', $product))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('products/show')
                ->where('product.id', $product->id)
                ->where('product.title', 'Sérum Glow Vitamin C')
                ->where('product.category.slug', 'cuidado-facial')
                ->has('product.images', 0)
                ->where('infoWhatsappUrl', null)
            );
    }

    public function test_product_detail_includes_whatsapp_info_link(): void
    {
        config(['store.whatsapp.number' => '5491112345678']);

        $category = Category::query()->create([
            'name' => 'Cuidado facial',
            'slug' => 'cuidado-facial-info',
        ]);

        $product = Product::query()->create([
            'category_id' => $category->id,
            'title' => 'Sérum Glow Vitamin C',
            'description' => 'Sérum antioxidante para iluminar la piel.',
            'price' => 18990,
        ]);

        $this->get(route('products.show', $product))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('products/show')
                ->where('infoWhatsappUrl', fn ($url) => is_string($url)
                    && str_contains($url, 'wa.me/5491112345678')
                    && str_contains(urldecode($url), 'Sérum Glow Vitamin C'))
            );
    }

    public function test_missing_product_returns_not_found(): void
    {
        $this->get('/productos/999')->assertNotFound();
    }
}
