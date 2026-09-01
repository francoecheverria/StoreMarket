<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'title',
        'description',
        'price',
        'stock',
    ];

    protected $appends = [
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::deleting(function (Product $product): void {
            $product->images()->get()->each->delete();
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::get(function (): ?string {
            $image = $this->relationLoaded('images')
                ? $this->images->first()
                : $this->images()->first();

            return $image?->image_url;
        });
    }

    public function isInStock(int $quantity = 1): bool
    {
        return $this->stock >= $quantity;
    }
}
