<?php

namespace App\Support;

class WhatsApp
{
    public static function number(): ?string
    {
        $number = preg_replace('/\D+/', '', (string) config('store.whatsapp.number'));

        return filled($number) ? $number : null;
    }

    public static function url(?string $name = null, ?string $message = null): ?string
    {
        $number = static::number();

        if (! $number) {
            return null;
        }

        $url = 'https://wa.me/'.$number;
        $parts = array_values(array_filter([
            filled($name) ? "Hola, soy {$name}." : null,
            filled($message) ? $message : null,
        ]));

        if ($parts !== []) {
            $url .= '?text='.rawurlencode(implode("\n\n", $parts));
        }

        return $url;
    }
}
