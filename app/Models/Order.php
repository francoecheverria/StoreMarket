<?php

namespace App\Models;

use App\Support\WhatsApp;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_CLOSED = 'closed';

    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'user_id',
        'customer_first_name',
        'customer_last_name',
        'customer_dni',
        'customer_address',
        'customer_phone',
        'customer_email',
        'total',
        'status',
        'payment_status',
        'payment_method',
        'stock_reserved',
        'mp_preference_id',
        'mp_payment_id',
    ];

    protected $appends = [
        'customer_full_name',
        'customer_whatsapp_url',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
            'stock_reserved' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function customerFullName(): Attribute
    {
        return Attribute::get(fn () => trim(($this->customer_first_name ?? '').' '.($this->customer_last_name ?? '')));
    }

    public function customerWhatsappUrl(): Attribute
    {
        return Attribute::get(function () {
            $name = $this->customer_full_name ?: 'hola';
            $message = "Hola {$name}, te escribo de Glow Market por tu pedido #{$this->id} para coordinar el pago y el envío por WhatsApp.";

            return WhatsApp::chatUrl($this->customer_phone, null, $message);
        });
    }

    public function storeWhatsappUrl(): ?string
    {
        $this->loadMissing('items');

        $lines = [
            "Acabo de realizar el pedido #{$this->id} por $".number_format((float) $this->total, 2, ',', '.').'.',
            'Productos:',
            ...$this->items->map(fn (OrderItem $item) => "- {$item->title} x {$item->quantity}")->all(),
            "DNI: {$this->customer_dni}",
            "Dirección: {$this->customer_address}",
            "Email: {$this->customer_email}",
            "Teléfono: {$this->customer_phone}",
            'Quiero coordinar el pago y el envío por WhatsApp.',
        ];

        return WhatsApp::url($this->customer_full_name, implode("\n", $lines));
    }
}
