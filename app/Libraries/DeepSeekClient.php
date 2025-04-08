<?php

namespace App\Libraries;

use GuzzleHttp\Client;
use Exception;

class DeepSeekClient
{
    protected $client;
    protected $apiKey;
    protected $baseUrl = 'https://api.deepseek.com/v1'; // Verify actual API endpoint

    public function __construct()
    {
        $this->apiKey = env('DEEPSEEK_API_KEY');
        $this->client = new Client([
            'base_uri' => $this->baseUrl,
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ]
        ]);
    }

    public function query(string $prompt): self
    {
        $this->prompt = $prompt;
        return $this;
    }

    public function run()
    {
        try {
            $response = $this->client->post('/chat/completions', [
                'json' => [
                    'model' => 'deepseek-chat', // Verify correct model name
                    'messages' => [
                        ['role' => 'user', 'content' => $this->prompt]
                    ]
                ]
            ]);

            $data = json_decode($response->getBody(), true);
            return $data['choices'][0]['message']['content'] ?? 'No response';

        } catch (Exception $e) {
            throw new Exception("DeepSeek API Error: " . $e->getMessage());
        }
    }
}