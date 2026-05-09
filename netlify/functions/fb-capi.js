// Facebook Conversions API proxy.
// Browser fbq() and this server event share an event_id so Meta dedupes them.
// Bypasses iOS 14.5+ ATT pixel blocks — server-side events arrive even when
// the in-page pixel is blocked by tracking prevention.

const PIXEL_ID = '1245057844149331';
const GRAPH_VERSION = 'v18.0';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const accessToken = process.env.FB_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('FB_ACCESS_TOKEN not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'CAPI not configured' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const {
    event_id,
    event_name,
    event_source_url,
    value,
    currency = 'USD',
    user_data = {},
    custom_data = {},
  } = payload;

  if (!event_id || !event_name) {
    return { statusCode: 400, body: JSON.stringify({ error: 'event_id and event_name required' }) };
  }

  // Strip nulls — Meta rejects null fields in user_data
  const cleanUserData = Object.fromEntries(
    Object.entries({
      em: user_data.em,
      ph: user_data.ph,
      fbp: user_data.fbp,
      fbc: user_data.fbc,
      client_ip_address: event.headers['x-nf-client-connection-ip']
        || event.headers['x-forwarded-for']?.split(',')[0]?.trim()
        || null,
      client_user_agent: user_data.client_user_agent || event.headers['user-agent'] || null,
    }).filter(([, v]) => v != null && v !== '')
  );

  const fbEvent = {
    event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id,
    event_source_url: event_source_url || null,
    action_source: 'website',
    user_data: cleanUserData,
    custom_data: {
      currency,
      value: typeof value === 'number' ? value : Number(value) || 0,
      ...Object.fromEntries(Object.entries(custom_data).filter(([, v]) => v != null && v !== '')),
    },
  };

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [fbEvent],
        access_token: accessToken,
      }),
    });

    const responseText = await res.text();
    if (!res.ok) {
      console.error('FB CAPI error', res.status, responseText);
      return { statusCode: 502, body: JSON.stringify({ error: 'CAPI upstream error', status: res.status, detail: responseText }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: responseText,
    };
  } catch (err) {
    console.error('FB CAPI exception', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'CAPI request failed' }) };
  }
};
