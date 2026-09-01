<?php

namespace App\Support;

class WhatsApp
{
    public static function number(): ?string
    {
        return static::normalize((string) config('store.whatsapp.number'));
    }

    public static function url(?string $name = null, ?string $message = null): ?string
    {
        return static::chatUrl(static::number(), $name, $message);
    }

    public static function chatUrl(?string $phone, ?string $name = null, ?string $message = null): ?string
    {
        $number = static::normalize($phone);

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

    public static function normalize(?string $phone): ?string
    {
        $digits = preg_replace('/\D+/', '', (string) $phone) ?: '';

        if ($digits === '') {
            return null;
        }

        if (str_starts_with($digits, '00')) {
            $digits = substr($digits, 2);
        }

        if (str_starts_with($digits, '54')) {
            return $digits;
        }

        $digits = ltrim($digits, '0');

        if ($digits === '') {
            return null;
        }

        if (strlen($digits) === 10) {
            return '549'.$digits;
        }

        if (strlen($digits) === 11 && str_starts_with($digits, '9')) {
            return '54'.$digits;
        }

        return '54'.$digits;
    }
}
