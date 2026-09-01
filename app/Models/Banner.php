<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Banner extends Model
{
    public const MAX_COUNT = 5;

    protected $fillable = [
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
        static::deleting(function (Banner $banner): void {
            if ($banner->image_path) {
                Storage::disk('public')->delete($banner->image_path);
            }
        });
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::get(fn (): string => '/storage/'.$this->image_path);
    }
}
