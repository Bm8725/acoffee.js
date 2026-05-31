const BASE = 'https://tiktokapis.com';

const VIDEO_FIELDS = [
  'id', 'title', 'video_description', 'create_time',
  'cover_image_url', 'share_url', 'duration',
  'view_count', 'like_count', 'comment_count',
  'share_count', 'hashtag_names',
].join(',');

export class TikTokPlatform {
  constructor(tokenManager) {
    this.tm = tokenManager;
  }

  async _headers() {
    return {
      'Authorization': `Bearer ${await this.tm.get()}`,
      'Content-Type':  'application/json',
    };
  }

  async profile() {
    const res = await fetch(
      `${BASE}/user/info/?fields=open_id,display_name,avatar_url,follower_count,following_count,likes_count,video_count,is_verified,bio_description`,
      { headers: await this._headers() }
    );
    const data = await res.json();
    if (data.error?.code !== 'ok') throw new Error(data.error?.message);
    return data.data.user;
  }

  async videos({ limit = 20, cursor = 0 } = {}) {
    const res = await fetch(
      `${BASE}/video/list/?fields=${VIDEO_FIELDS}`,
      {
        method: 'POST',
        headers: await this._headers(),
        body: JSON.stringify({ max_count: limit, cursor }),
      }
    );
    const data = await res.json();
    return {
      videos:  data.data?.videos ?? [],
      cursor:  data.data?.cursor,
      hasMore: data.data?.has_more,
    };
  }

  async searchByHashtag(hashtag, { limit = 20 } = {}) {
    const res = await fetch(
      `${BASE}/video/search/?fields=${VIDEO_FIELDS}`,
      {
        method: 'POST',
        headers: await this._headers(),
        body: JSON.stringify({
          query: {
            and: [{ operation: 'IN', field_name: 'hashtag_name', field_values: [hashtag] }]
          },
          max_count: limit,
        }),
      }
    );
    const data = await res.json();
    const videos = data.data?.videos ?? [];

    return videos.map(v => ({
      ...v,
      engagement_rate: v.view_count > 0
        ? +((v.like_count + v.comment_count + v.share_count) / v.view_count * 100).toFixed(2)
        : 0,
    }));
  }

  async trending(keyword = 'fyp', { limit = 10, minViews = 10000 } = {}) {
    const videos = await this.searchByHashtag(keyword, { limit: 50 });
    return videos
      .filter(v => v.view_count >= minViews)
      .sort((a, b) => b.engagement_rate - a.engagement_rate)
      .slice(0, limit);
  }
}
