<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/banners/index', [
            'banners' => Banner::query()->orderBy('sort_order')->get(),
            'maxCount' => Banner::MAX_COUNT,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $inputSlots = $request->input('slots', []) ?? [];
        $fileSlots = $request->file('slots') ?? [];

        if (! is_array($inputSlots)) {
            $inputSlots = [];
        }

        if (! is_array($fileSlots)) {
            $fileSlots = [];
        }

        $lastIndex = max(
            $inputSlots === [] ? -1 : (int) max(array_keys($inputSlots)),
            $fileSlots === [] ? -1 : (int) max(array_keys($fileSlots)),
        );

        if ($lastIndex + 1 > Banner::MAX_COUNT) {
            throw ValidationException::withMessages([
                'slots' => 'Podés cargar como máximo '.Banner::MAX_COUNT.' banners.',
            ]);
        }

        $slots = [];

        for ($index = 0; $index <= $lastIndex; $index++) {
            $slot = $inputSlots[$index] ?? [];

            if (! is_array($slot)) {
                $slot = [];
            }

            if (($slot['id'] ?? '') === '') {
                $slot['id'] = null;
            }

            unset($slot['image']);
            $slots[$index] = $slot;
        }

        $request->merge(['slots' => $slots]);

        $validated = $request->validate([
            'slots' => ['nullable', 'array', 'max:'.Banner::MAX_COUNT],
            'slots.*.id' => ['nullable', 'integer', 'exists:banners,id'],
            'slots.*.image' => ['nullable', 'file', 'image', 'mimes:jpeg,jpg,png,webp', 'max:4096'],
        ]);

        $slots = $validated['slots'] ?? [];

        foreach ($slots as $index => $slot) {
            $hasExisting = filled($slot['id'] ?? null);
            $hasImage = $request->hasFile("slots.{$index}.image");

            if (! $hasExisting && ! $hasImage) {
                throw ValidationException::withMessages([
                    "slots.{$index}.image" => 'Subí una imagen para este banner.',
                ]);
            }
        }

        $keptIds = [];

        foreach ($slots as $index => $slot) {
            $banner = filled($slot['id'] ?? null)
                ? Banner::query()->findOrFail($slot['id'])
                : new Banner;

            if ($request->hasFile("slots.{$index}.image")) {
                if ($banner->image_path) {
                    Storage::disk('public')->delete($banner->image_path);
                }

                $banner->image_path = $request->file("slots.{$index}.image")->store('banners', 'public');
            }

            $banner->sort_order = $index;
            $banner->save();
            $keptIds[] = $banner->id;
        }

        $query = Banner::query();

        if ($keptIds !== []) {
            $query->whereNotIn('id', $keptIds);
        }

        $query->get()->each->delete();

        return back()->with('success', 'Banners actualizados.');
    }
}
