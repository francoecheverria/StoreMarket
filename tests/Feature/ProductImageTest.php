<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductImageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        Storage::fake('public');
    }

    public function test_admin_can_upload_product_images(): void
    {
        $category = Category::query()->create([
            'name' => 'Cuidado facial',
            'slug' => 'cuidado-facial',
        ]);

        $this->actingAs(User::factory()->admin()->create())
            ->post(route('admin.products.store'), [
                'title' => 'Sérum Glow',
                'description' => 'Sérum de prueba.',
                'price' => 18990,
                'stock' => 8,
                'category_id' => $category->id,
                'images' => [
                    UploadedFile::fake()->image('frente.jpg'),
                    UploadedFile::fake()->image('detalle.png'),
                ],
            ])
            ->assertRedirect(route('admin.products.index'));

        $product = Product::query()->first();

        $this->assertNotNull($product);
        $this->assertDatabaseCount('product_images', 2);
        $this->assertTrue(Storage::disk('public')->exists($product->images()->first()->image_path));

        $this->get(route('products.show', $product))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('products/show')
                ->has('product.images', 2)
                ->where('product.image_url', fn ($url) => is_string($url) && str_starts_with($url, '/storage/'))
            );
    }

    public function test_admin_cannot_upload_more_than_eight_images(): void
    {
        $category = Category::query()->create([
            'name' => 'Maquillaje',
            'slug' => 'maquillaje',
        ]);

        $images = [];

        for ($index = 0; $index < 9; $index++) {
            $images[] = UploadedFile::fake()->image("foto-{$index}.jpg");
        }

        $this->actingAs(User::factory()->admin()->create())
            ->post(route('admin.products.store'), [
                'title' => 'Labial',
                'description' => 'Color satinado.',
                'price' => 7990,
                'stock' => 4,
                'category_id' => $category->id,
                'images' => $images,
            ])
            ->assertSessionHasErrors('images');

        $this->assertDatabaseCount('products', 0);
        $this->assertDatabaseCount('product_images', 0);
    }

    public function test_admin_can_remove_a_product_image(): void
    {
        $this->actingAs(User::factory()->admin()->create());

        $category = Category::query()->create([
            'name' => 'Cabello',
            'slug' => 'cabello',
        ]);

        $this->post(route('admin.products.store'), [
            'title' => 'Shampoo glow',
            'description' => 'Limpieza suave.',
            'price' => 10990,
            'stock' => 6,
            'category_id' => $category->id,
            'images' => [
                UploadedFile::fake()->image('keep.jpg'),
                UploadedFile::fake()->image('remove.jpg'),
            ],
        ]);

        $product = Product::query()->firstOrFail();
        $kept = $product->images()->orderBy('sort_order')->first();
        $removed = $product->images()->orderBy('sort_order')->skip(1)->first();
        $removedPath = $removed->image_path;

        $this->post(route('admin.products.update', $product), [
            '_method' => 'put',
            'title' => $product->title,
            'description' => $product->description,
            'price' => $product->price,
            'stock' => $product->stock,
            'category_id' => $product->category_id,
            'remove_image_ids' => [$removed->id],
        ])->assertRedirect(route('admin.products.index'));

        $this->assertDatabaseCount('product_images', 1);
        $this->assertDatabaseHas('product_images', ['id' => $kept->id]);
        $this->assertFalse(Storage::disk('public')->exists($removedPath));
    }
}
