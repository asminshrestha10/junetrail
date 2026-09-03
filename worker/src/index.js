/**
 * @typedef {Object} Env
 * @property {string} ADMIN_USERNAME Cloudflare Worker variable containing the admin username.
 * @property {string} ADMIN_PASSWORD Cloudflare Worker secret containing the admin password.
 * @property {string} SESSION_SECRET Cloudflare Worker secret used to sign sessions.
 * @property {string} ALLOWED_ORIGINS Comma-separated allowed browser origins.
 * @property {string} [GITHUB_APP_ID]
 * @property {string} [GITHUB_INSTALLATION_ID]
 * @property {string} [GITHUB_APP_PRIVATE_KEY]
 * @property {string} [REPO_OWNER]
 * @property {string} [REPO_NAME]
 * @property {string} [REPO_BRANCH]
 * @property {string} [CONTENT_TYPES]
 * @property {string} [APP_ENV]
 */

const CONTENT_MAP = {
  news: 'data/news.json',
  blogs: 'data/blogs.json',
  vehicles: 'data/vehicles.json',
  products: 'data/products.json',
  guides: 'data/guides.json',
  engineering: 'data/engineering.json'
};

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...extraHeaders
    }
  });
}

function getCorsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const allowOrigin = allowed.includes(origin) ? origin : (allowed[0] || '');

  return {
    ...(allowOrigin ? { 'Access-Control-Allow-Origin': allowOrigin } : {}),
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  };
}

function base64UrlEncode(value) {
  return btoa(String.fromCharCode(...new Uint8Array(value)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const binary = atob(normalized + padding);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return bytes;
}

async function createSignedSession(user, secret) {
  const payload = {
    user,
    exp: Date.now() + 24 * 60 * 60 * 1000
  };

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  const payloadString = JSON.stringify(payload);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadString));
  return `${base64UrlEncode(encoder.encode(payloadString))}.${base64UrlEncode(signature)}`;
}

async function verifySessionToken(token, secret) {
  if (!token || !token.includes('.')) {
    return null;
  }

  const [payloadPart, signaturePart] = token.split('.');
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  const payloadBytes = base64UrlDecode(payloadPart);
  const signatureBytes = base64UrlDecode(signaturePart);

  const valid = await crypto.subtle.verify('HMAC', key, signatureBytes.buffer, payloadBytes.buffer);
  if (!valid) {
    return null;
  }

  try {
    const parsed = JSON.parse(new TextDecoder().decode(payloadBytes));
    if (!parsed.user || parsed.exp < Date.now()) {
      return null;
    }
    return parsed.user;
  } catch (error) {
    return null;
  }
}

function parseJsonBody(request) {
  return request.text().then((text) => {
    if (!text) {
      return {};
    }
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error('Request body is not valid JSON.');
    }
  });
}

function getCookieValue(cookieHeader, name) {
  if (!cookieHeader) {
    return '';
  }

  const match = cookieHeader
    .split(';')
    .map((chunk) => chunk.trim())
    .find((chunk) => chunk.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : '';
}

function timingSafeEquals(a, b) {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  const length = Math.max(aBytes.length, bBytes.length);
  let mismatch = 0;

  for (let index = 0; index < length; index += 1) {
    const aByte = aBytes[index] ?? 0;
    const bByte = bBytes[index] ?? 0;
    mismatch += aByte === bByte ? 0 : 1;
  }

  return mismatch === 0 && aBytes.length === bBytes.length;
}

function getContentKey(type) {
  if (!Object.prototype.hasOwnProperty.call(CONTENT_MAP, type)) {
    throw new Error('Invalid content type.');
  }
  return CONTENT_MAP[type];
}

function getRequiredEnvVar(env, name) {
  const value = env[name];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${name} is missing or empty.`);
  }
  return value;
}

async function getGitHubAccessToken(env) {
  const appId = env.GITHUB_APP_ID;
  const installationId = env.GITHUB_INSTALLATION_ID;
  const privateKey = env.GITHUB_APP_PRIVATE_KEY;

  if (!appId || !installationId || !privateKey || String(appId).trim() === '' || String(installationId).trim() === '' || String(privateKey).trim() === '') {
    throw new Error('GitHub App configuration is missing.');
  }

  const normalizedPrivateKey = String(privateKey).replace(/\\n/g, '\n');

  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60,
    exp: now + 600,
    iss: appId
  };

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToBinary(normalizedPrivateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const unsigned = `${base64UrlEncode(enc.encode(JSON.stringify(header)))}.${base64UrlEncode(enc.encode(JSON.stringify(payload)))}`;
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(unsigned));
  const jwt = `${unsigned}.${base64UrlEncode(signature)}`;

  const response = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'junetrail-admin-worker'
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub App token request failed: ${response.status} ${text}`);
  }

  const tokenData = await response.json();
  return tokenData.token;
}

function pemToBinary(pem) {
  const isPkcs1 = pem.includes('-----BEGIN RSA PRIVATE KEY-----');
  const header = isPkcs1 ? '-----BEGIN RSA PRIVATE KEY-----' : '-----BEGIN PRIVATE KEY-----';
  const footer = isPkcs1 ? '-----END RSA PRIVATE KEY-----' : '-----END PRIVATE KEY-----';
  const base64 = pem.replace(header, '').replace(footer, '').replace(/\s+/g, '');
  const keyBytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));

  if (!isPkcs1) {
    return keyBytes;
  }

  const algorithmIdentifier = Uint8Array.from([
    0x30, 0x0d,
    0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01,
    0x05, 0x00
  ]);
  const version = Uint8Array.from([0x02, 0x01, 0x00]);
  const privateKey = derEncode(0x04, keyBytes);
  return derEncode(0x30, concatBytes(version, algorithmIdentifier, privateKey));
}

function derEncode(tag, value) {
  const length = value.length;
  const lengthBytes = length < 128
    ? Uint8Array.from([length])
    : Uint8Array.from([0x80 | Math.ceil(Math.log2(length + 1) / 8), ...numberToBytes(length)]);
  return concatBytes(Uint8Array.from([tag]), lengthBytes, value);
}

function numberToBytes(value) {
  const bytes = [];
  for (let remaining = value; remaining > 0; remaining = Math.floor(remaining / 256)) {
    bytes.unshift(remaining & 0xff);
  }
  return bytes.length ? bytes : [0];
}

function concatBytes(...arrays) {
  const result = new Uint8Array(arrays.reduce((total, array) => total + array.length, 0));
  let offset = 0;
  for (const array of arrays) {
    result.set(array, offset);
    offset += array.length;
  }
  return result;
}

async function getGitHubFile(path, env) {
  const token = await getGitHubAccessToken(env);
  const owner = env.REPO_OWNER || 'asminshrestha10';
  const repo = env.REPO_NAME || 'junetrail';

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'junetrail-admin-worker'
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub read failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  const decoded = data.content ? atob(data.content.replace(/\n/g, '')) : '';

  return {
    sha: data.sha,
    filePath: path,
    content: decoded,
    raw: data
  };
}

async function saveGitHubFile(path, jsonData, sha, env) {
  const token = await getGitHubAccessToken(env);
  const owner = env.REPO_OWNER || 'asminshrestha10';
  const repo = env.REPO_NAME || 'junetrail';
  const branch = env.REPO_BRANCH || 'main';

  const body = {
    message: `Update ${path} via JUNE TRAIL admin`,
    content: btoa(unescape(encodeURIComponent(JSON.stringify(jsonData, null, 2)))),
    sha,
    branch
  };

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'junetrail-admin-worker',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub save failed: ${response.status} ${text}`);
  }

  return await response.json();
}

async function requireAdmin(request, env) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const token = getCookieValue(cookieHeader, 'junetrail_admin_session');
  if (!token) {
    return null;
  }

  const sessionSecret = getRequiredEnvVar(env, 'SESSION_SECRET');
  const user = await verifySessionToken(token, sessionSecret);
  if (!user) {
    return null;
  }

  return user;
}

function ensureAllowedOrigin(request, env) {
  const corsHeaders = getCorsHeaders(request, env);
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  return null;
}

async function handleLogin(request, env) {
  const body = await parseJsonBody(request).catch((error) => { throw error; });
  const username = String(body.username || '').trim();
  const password = String(body.password || '');

  const expectedUser = env.ADMIN_USERNAME;
  const expectedPassword = env.ADMIN_PASSWORD;

  if (typeof expectedUser !== 'string' || expectedUser.trim() === '' || typeof expectedPassword !== 'string' || expectedPassword.trim() === '') {
    return jsonResponse({ error: 'Admin credentials are not configured on the server.' }, 500);
  }

  if (username !== expectedUser || !timingSafeEquals(password, expectedPassword)) {
    return jsonResponse({ error: 'Login failed.' }, 401);
  }

  const sessionSecret = getRequiredEnvVar(env, 'SESSION_SECRET');
  const sessionToken = await createSignedSession(username, sessionSecret);
  const cookie = `junetrail_admin_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=86400`;
  return jsonResponse({ ok: true, user: username }, 200, { 'Set-Cookie': cookie });
}

async function handleLogout() {
  return jsonResponse({ ok: true }, 200, {
    'Set-Cookie': 'junetrail_admin_session=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0'
  });
}

async function handleSession(request, env) {
  const user = await requireAdmin(request, env);
  if (!user) {
    return jsonResponse({ authenticated: false }, 401);
  }
  return jsonResponse({ authenticated: true, user }, 200);
}

async function readContentItem(section, env) {
  const filePath = getContentKey(section);
  const file = await getGitHubFile(filePath, env);

  try {
    const parsed = JSON.parse(file.content);
    if (!Array.isArray(parsed)) {
      throw new Error('The JSON file does not contain an array.');
    }
    return { filePath, data: parsed, sha: file.sha };
  } catch (error) {
    throw new Error(`Failed to parse ${filePath}: ${error.message}`);
  }
}

async function handleListContent(request, env, type) {
  const user = await requireAdmin(request, env);
  if (!user) {
    return jsonResponse({ error: 'You are not authenticated.' }, 401);
  }

  try {
    const { data } = await readContentItem(type, env);
    return jsonResponse({ ok: true, items: data }, 200);
  } catch (error) {
    return jsonResponse({ error: error.message }, 400);
  }
}

async function handleCreateOrUpdateContent(request, env, type, id) {
  const user = await requireAdmin(request, env);
  if (!user) {
    return jsonResponse({ error: 'You are not authenticated.' }, 401);
  }

  try {
    const payload = await parseJsonBody(request);
    const item = payload.item || payload;
    const { data, sha, filePath } = await readContentItem(type, env);

    if (!Array.isArray(data)) {
      throw new Error('The requested JSON file does not contain an array.');
    }

    if (id) {
      const index = data.findIndex((entry) => String(entry.id || entry.slug) === String(id));
      if (index === -1) {
        return jsonResponse({ error: 'The requested item was not found.' }, 404);
      }
      data[index] = { ...data[index], ...item, id: data[index].id || item.id || id };
    } else {
      data.push({ ...item, id: item.id || `${type}-${Date.now()}` });
    }

    const finalJson = data;
    const saved = await saveGitHubFile(filePath, finalJson, sha, env);
    return jsonResponse({ ok: true, item: finalJson[id ? finalJson.find((entry) => String(entry.id || entry.slug) === String(id)) : finalJson[finalJson.length - 1]], commit: saved }, 200);
  } catch (error) {
    return jsonResponse({ error: error.message }, 400);
  }
}

async function handleDeleteContent(request, env, type, id) {
  const user = await requireAdmin(request, env);
  if (!user) {
    return jsonResponse({ error: 'You are not authenticated.' }, 401);
  }

  try {
    const { data, sha, filePath } = await readContentItem(type, env);
    const next = data.filter((entry) => String(entry.id || entry.slug) !== String(id));
    const saved = await saveGitHubFile(filePath, next, sha, env);
    return jsonResponse({ ok: true, deleted: id, commit: saved }, 200);
  } catch (error) {
    return jsonResponse({ error: error.message }, 400);
  }
}

async function handleSave(request, env) {
  const user = await requireAdmin(request, env);
  if (!user) {
    return jsonResponse({ error: 'You are not authenticated.' }, 401);
  }

  try {
    const payload = await parseJsonBody(request);
    if (!payload || typeof payload !== 'object') {
      throw new Error('A valid object payload is required.');
    }

    const section = String(payload.section || '').trim();
    if (!Object.prototype.hasOwnProperty.call(CONTENT_MAP, section)) {
      throw new Error('Invalid content section.');
    }

    const filePath = getContentKey(section);
    const { sha } = await getGitHubFile(filePath, env);
    const items = Array.isArray(payload.items) ? payload.items : [];
    const saved = await saveGitHubFile(filePath, items, sha, env);
    return jsonResponse({ ok: true, filePath, commit: saved }, 200);
  } catch (error) {
    return jsonResponse({ error: error.message }, 400);
  }
}

export default {
  /**
   * @param {Request} request
   * @param {Env} env
   */
  async fetch(request, env) {
    const corsOption = ensureAllowedOrigin(request, env);
    if (corsOption) {
      return corsOption;
    }

    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = getCorsHeaders(request, env);

    if (path === '/api/admin/login' && request.method === 'POST') {
      try {
        const response = await handleLogin(request, env);
        return new Response(response.body, {
          status: response.status,
          headers: { ...corsHeaders, ...(Object.fromEntries(response.headers.entries())) }
        });
      } catch (error) {
        return jsonResponse({ error: error.message }, 400, corsHeaders);
      }
    }

    if (path === '/api/admin/logout' && request.method === 'POST') {
      const response = await handleLogout();
      return new Response(response.body, {
        status: response.status,
        headers: { ...corsHeaders, ...(Object.fromEntries(response.headers.entries())) }
      });
    }

    if (path === '/api/admin/session' && request.method === 'GET') {
      const response = await handleSession(request, env);
      return new Response(response.body, {
        status: response.status,
        headers: { ...corsHeaders, ...(Object.fromEntries(response.headers.entries())) }
      });
    }

    if (path === '/api/admin/save' && request.method === 'POST') {
      const response = await handleSave(request, env);
      return new Response(response.body, {
        status: response.status,
        headers: { ...corsHeaders, ...(Object.fromEntries(response.headers.entries())) }
      });
    }

    const contentMatch = path.match(/^\/api\/admin\/content\/([^/]+)(?:\/([^/]+))?$/);
    if (contentMatch) {
      const type = contentMatch[1];
      const id = contentMatch[2] || null;

      if (request.method === 'GET' && !id) {
        const response = await handleListContent(request, env, type);
        return new Response(response.body, {
          status: response.status,
          headers: { ...corsHeaders, ...(Object.fromEntries(response.headers.entries())) }
        });
      }

      if (request.method === 'POST' && !id) {
        const response = await handleCreateOrUpdateContent(request, env, type, null);
        return new Response(response.body, {
          status: response.status,
          headers: { ...corsHeaders, ...(Object.fromEntries(response.headers.entries())) }
        });
      }

      if (request.method === 'PUT' && id) {
        const response = await handleCreateOrUpdateContent(request, env, type, id);
        return new Response(response.body, {
          status: response.status,
          headers: { ...corsHeaders, ...(Object.fromEntries(response.headers.entries())) }
        });
      }

      if (request.method === 'DELETE' && id) {
        const response = await handleDeleteContent(request, env, type, id);
        return new Response(response.body, {
          status: response.status,
          headers: { ...corsHeaders, ...(Object.fromEntries(response.headers.entries())) }
        });
      }
    }

    return jsonResponse({ error: 'Not found.' }, 404, corsHeaders);
  }
};
