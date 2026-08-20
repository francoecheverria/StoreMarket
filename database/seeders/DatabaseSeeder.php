<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@glowmarket.test'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('password'),
                'is_admin' => true,
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'cliente@glowmarket.test'],
            [
                'name' => 'Cliente Demo',
                'password' => Hash::make('password'),
                'is_admin' => false,
            ]
        );

        $catalog = [
            'Cuidado facial' => [
                ['Sérum Glow Vitamin C', 'Sérum antioxidante para iluminar la piel. Título, descripción y precio simples.', 18990],
                ['Crema hidratante diaria', 'Hidratación ligera para todo tipo de piel.', 14990],
                ['Limpiador suave', 'Gel de limpieza que no reseca.', 9990],
            ],
            'Maquillaje' => [
                ['Labial nude glow', 'Color satinado de larga duración.', 7990],
                ['Máscara de pestañas', 'Volumen y definición en un solo paso.', 8990],
            ],
            'Cabello' => [
                ['Aceite reparador', 'Nutrición para puntas y brillo natural.', 11990],
                ['Shampoo glow', 'Limpieza suave con aroma floral.', 10990],
            ],
            'Fragancias' => [
                ['Eau de parfum Amber', 'Notas cálidas de ámbar y vainilla.', 24990],
            ],
        ];

        foreach ($catalog as $categoryName => $products) {
            $category = Category::query()->updateOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($categoryName)],
                ['name' => $categoryName]
            );

            foreach ($products as [$title, $description, $price]) {
                Product::query()->updateOrCreate(
                    ['title' => $title],
                    [
                        'category_id' => $category->id,
                        'description' => $description,
                        'price' => $price,
                    ]
                );
            }
        }
    }
}
