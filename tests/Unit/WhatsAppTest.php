<?php

namespace Tests\Unit;

use App\Support\WhatsApp;
use PHPUnit\Framework\TestCase;

class WhatsAppTest extends TestCase
{
    public function test_normalizes_argentine_mobile_numbers(): void
    {
        $this->assertSame('5491155551234', WhatsApp::normalize('11 5555-1234'));
        $this->assertSame('5491155551234', WhatsApp::normalize('011 5555-1234'));
        $this->assertSame('5491155551234', WhatsApp::normalize('+54 9 11 5555-1234'));
        $this->assertSame('5491155551234', WhatsApp::normalize('5491155551234'));
    }

    public function test_builds_chat_url_for_a_customer_number(): void
    {
        $url = WhatsApp::chatUrl('1155551234', null, 'Hola');

        $this->assertSame('https://wa.me/5491155551234?text='.rawurlencode('Hola'), $url);
    }
}
