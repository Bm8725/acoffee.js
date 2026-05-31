import { TikTokPlatform }    from '../platforms/tiktok.js';
import { SmileLivePlatform }  from '../platforms/smile.js';
import { TokenManager }       from './token.js';

export class AcoffeeClient {
  constructor(config = {}) {
    this.config = config;
    this.tokens = {};

    this.tiktok = null;
    this.smile  = new SmileLivePlatform(config);
  }

  connectTikTok({ clientKey, clientSecret, accessToken, refreshToken }) {
    const manager = new TokenManager({
      clientKey,
      clientSecret,
      accessToken,
      refreshToken,
      platform: 'tiktok',
    });
    this.tiktok = new TikTokPlatform(manager);
    return this; 
  }
}

let instance = null;
export function createClient(config) {
  if (!instance) instance = new AcoffeeClient(config);
  return instance;
}
