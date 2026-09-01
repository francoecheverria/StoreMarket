<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProductImage extends Model
{
    public const MAX_COUNT = 8;

    protected $fillable = [
        'product_id',
        'image_path',
        'sort_order',
    ];

    protected $hidden = [
        'image_path',
    ];

    protected $appends = [
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::deleting(function (ProductImage $image): void {
            if ($image->image_path) {
                Storage::disk('public')->delete($image->image_path);
            }
        });
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::get(fn (): string => '/storage/'.$this->image_path);
    }
}
