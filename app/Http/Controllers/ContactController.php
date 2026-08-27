<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Support\WhatsApp;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class ContactController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('contact', [
            'whatsappConfigured' => filled(WhatsApp::number()),
        ]);
    }

    public function store(Request $request): HttpResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        Contact::create($validated);

        $whatsappUrl = WhatsApp::url($validated['name'], $validated['message']);

        if ($whatsappUrl) {
            return Inertia::location($whatsappUrl);
        }

        return back()->with('success', 'Mensaje guardado. Configurá WHATSAPP_NUMBER en el .env para abrirlo en WhatsApp.');
    }
}
