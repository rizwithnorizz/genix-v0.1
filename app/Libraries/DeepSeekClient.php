<?php

namespace App\Libraries;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class DeepSeekClient
{
    protected $client;
    protected $apiKey;
    protected $apiEndpoint = 'https://api.deepseek.com/v1/chat/completions';
    protected $prompt;
    protected $model = 'deepseek-coder';
    protected $temperature = 0.1;
    protected $maxTokens = 8192; 

    public function __construct()
    {
        $this->client = new Client();
        $this->apiKey = env('DEEPSEEK_API_KEY');
        
        if (!$this->apiKey) {
            throw new \Exception('DeepSeek API key not found in environment');
        }
    }

    public function query($prompt)
    {
        $this->prompt = $prompt;
        return $this;
    }
    
    public function setModel($model)
    {
        $this->model = $model;
        return $this;
    }
    
    public function setTemperature($temperature)
    {
        $this->temperature = $temperature;
        return $this;
    }
    
    public function setMaxTokens($maxTokens)
    {
        // Ensure max_tokens is within valid range (1 to 8192)
        $this->maxTokens = min(8192, max(1, $maxTokens));
        return $this;
    }

    public function run()
    {
            try {
            $response = $this->client->post($this->apiEndpoint, [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer ' . $this->apiKey
                ],
                'json' => [
                    'model' => $this->model,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are a helpful assistant. Capable of parsing documents and accomodating requests for schedule adjustments.'
                        ],
                        [
                            'role' => 'user',
                            'content' => $this->prompt
                        ]
                    ],
                    'temperature' => $this->temperature,
                    'max_tokens' => $this->maxTokens
                ]
            ]);
            $body = json_decode($response->getBody(), true);
            
            if (isset($body['choices'][0]['message']['content'])) {
                return $body['choices'][0]['message']['content'];
            } else {
                Log::error('Invalid DeepSeek API response format', ['response' => $body]);
                throw new \Exception('Invalid API response format');
            }
        } catch (\Exception $e) {
            throw $e;
        }
    }
}