<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::createAssetPathsUsing(function (string $path, ?bool $secure = null) {
            return '/'.ltrim($path, '/');
        });

        $appUrl = (string) config('app.url');

        if (! str_contains($appUrl, 'localhost') && ! str_contains($appUrl, '127.0.0.1')) {
            URL::forceScheme('https');
        }
    }
}
