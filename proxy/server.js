#!/usr/bin/env node
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { URL } = require('url');

// Load environment variables from .env if present
dotenv.config();

const fetch = (...args) => import('node-fetch').then(({ default: fetchFn }) => fetchFn(...args));

const app = express();
app.use(cors());
// Keep multipart/form-data untouched
app.use(
  express.raw({
    type: () => true,
    limit: '25mb',
  })
);

const DEFAULT_PLANTNET_URL = 'https://my-api.plantnet.org/v2/identify/all';

function buildPlantNetUrl(targetUrl) {
  if (targetUrl) {
    try {
      // Validate provided target
      // eslint-disable-next-line no-new
      new URL(targetUrl);
      return targetUrl;
    } catch (error) {
      console.warn('[plantnet proxy] Invalid target URL provided, falling back:', error);
    }
  }
  const apiKey = process.env.PLANTNET_API_KEY || process.env.EXPO_PUBLIC_PLANTNET_API_KEY;
  if (!apiKey) {
    throw new Error('Missing PlantNet API key. Set PLANTNET_API_KEY in proxy environment.');
  }
  const params = new URLSearchParams({
    'api-key': apiKey,
    lang: 'en',
    'include-related-images': 'false',
    'no-reject': 'false',
  });
  return `${DEFAULT_PLANTNET_URL}?${params.toString()}`;
}

app.post('/plantnet', async (req, res) => {
  try {
    const targetParam = req.query.target;
    const decodedTarget = typeof targetParam === 'string' ? decodeURIComponent(targetParam) : undefined;
    const plantNetUrl = buildPlantNetUrl(decodedTarget);

    const forwardResponse = await fetch(plantNetUrl, {
      method: 'POST',
      headers: {
        'content-type': req.headers['content-type'] || 'application/octet-stream',
      },
      body: req.body,
    });

    res.status(forwardResponse.status);
    forwardResponse.body?.pipe(res);
  } catch (error) {
    console.error('[plantnet proxy] Request failed:', error);
    res.status(500).json({ message: 'Proxy request failed', error: error.message });
  }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`[plantnet proxy] Listening on http://localhost:${port}/plantnet`);
});
