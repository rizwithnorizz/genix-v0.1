<?php

namespace App\Providers;

use DeepSeekClient;
use Illuminate\Support\ServiceProvider;

class DeepSeekServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(DeepSeekClient::class, function ($app) {
            return new DeepSeekClient([
                'api_key' => env('DEEPSEEK_API_KEY'), // If needed
                // Other configuration
            ]);
        });
    }

    public function boot()
    {
        //
    }
}