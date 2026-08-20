<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $products = Product::query()
            ->with('category')
            ->when($request->filled('q'), fn ($query) => $query->where('title', 'like', '%'.$request->string('q').'%'))
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->whereHas('category', fn ($category) => $category->where('slug', $request->string('category')));
            })
            ->latest()
            ->get();

        return Inertia::render('home', [
            'banner' => config('store.banner'),
            'products' => $products,
            'filters' => [
                'q' => $request->string('q')->toString(),
                'category' => $request->string('category')->toString(),
            ],
            'activeCategory' => $request->filled('category')
                ? Category::query()->where('slug', $request->string('category'))->first()
                : null,
        ]);
    }
}
