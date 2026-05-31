export class TokenManager {
  constructor({ clientKey, clientSecret, accessToken, refreshToken, platform }) {
    this.clientKey     = clientKey;
    this.clientSecret  = clientSecret;
    this.token         = accessToken;
    this.refreshToken  = refreshToken;
    this.platform      = platform;
    this.expiresAt     = null;
  }

  async get() {
    if (this._isExpired()) await this._refresh();
    return this.token;
  }

  _isExpired() {
    if (!this.expiresAt) return false;
    return Date.now() >= this.expiresAt - 60_000;
  }

  async _refresh() {
    const res = await fetch('https://tiktokapis.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key:    this.clientKey,
        client_secret: this.clientSecret,
        grant_type:    'refresh_token',
        refresh_token: this.refreshToken,
      }),
    });
    const data = await res.json();
    this.token     = data.access_token;
    this.expiresAt = Date.now() + data.expires_in * 1000;
  }
}
