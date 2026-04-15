import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

test('GET /api/health returns ok status', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`);
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.status, 'ok');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
