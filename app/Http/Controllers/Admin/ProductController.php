<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/products/index', [
            'products' => Product::query()->with(['category', 'images'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/form', [
            'product' => null,
            'categories' => Category::query()->orderBy('name')->get(),
            'maxImages' => ProductImage::MAX_COUNT,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $product = Product::create($this->validated($request));
        $this->syncImages($request, $product);

        return redirect()->route('admin.products.index')->with('success', 'Producto creado.');
    }

    public function edit(Product $product): Response
    {
        $product->load('images');

        return Inertia::render('admin/products/form', [
            'product' => $product,
            'categories' => Category::query()->orderBy('name')->get(),
            'maxImages' => ProductImage::MAX_COUNT,
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $product->update($this->validated($request));
        $this->syncImages($request, $product);

        return redirect()->route('admin.products.index')->with('success', 'Producto actualizado.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Producto eliminado.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'images' => ['nullable', 'array', 'max:'.ProductImage::MAX_COUNT],
            'images.*' => ['image', 'mimes:jpeg,jpg,png,webp', 'max:4096'],
            'remove_image_ids' => ['nullable', 'array'],
            'remove_image_ids.*' => ['integer', 'exists:product_images,id'],
        ]);

        return [
            'title' => $data['title'],
            'description' => $data['description'],
            'price' => $data['price'],
            'stock' => $data['stock'],
            'category_id' => $data['category_id'],
        ];
    }

    private function syncImages(Request $request, Product $product): void
    {
        $removeIds = collect($request->input('remove_image_ids', []))
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->all();

        if ($removeIds !== []) {
            $product->images()->whereIn('id', $removeIds)->get()->each->delete();
        }

        $files = $request->file('images', []);

        if (! is_array($files)) {
            $files = $files ? [$files] : [];
        }

        $files = array_values(array_filter($files));

        if ($product->images()->count() + count($files) > ProductImage::MAX_COUNT) {
            throw ValidationException::withMessages([
                'images' => 'Podés cargar como máximo '.ProductImage::MAX_COUNT.' imágenes.',
            ]);
        }

        $sortOrder = (int) $product->images()->max('sort_order');

        foreach ($files as $file) {
            $sortOrder++;
            $product->images()->create([
                'image_path' => $file->store('products', 'public'),
                'sort_order' => $sortOrder,
            ]);
        }
    }
}
