<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Support\WhatsApp;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(Product $product): Response
    {
        $product->load(['category', 'images']);

        return Inertia::render('products/show', [
            'product' => $product,
            'infoWhatsappUrl' => WhatsApp::url(
                null,
                "Hola, quiero más información sobre \"{$product->title}\"."
            ),
        ]);
    }
}
