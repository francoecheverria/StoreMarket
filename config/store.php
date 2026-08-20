<?php

return [
    'banner' => [
        'title' => env('STORE_BANNER_TITLE', 'GlowMarket'),
        'description' => env(
            'STORE_BANNER_DESCRIPTION',
            'Cosmética y cuidado personal con envío a todo el país. Elegí tus favoritos y pagá con Mercado Pago.'
        ),
        'price' => env('STORE_BANNER_PRICE', 12990),
    ],
];
