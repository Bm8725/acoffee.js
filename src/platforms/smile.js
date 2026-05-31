const BASE_SMILE = 'https://smileliveapp.com';

export class SmileLivePlatform {
  constructor(config = {}) {
    this.config = config;
  }

  async getLiveStats(username) {
    if (!username) throw new Error("Username-ul SmileLive este obligatoriu.");

    try {
      const res = await fetch(`${BASE_SMILE}/user/${username}/profile`, {
        next: { revalidate: 30 },
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Acoffeejs-Analytics-Engine/1.0'
        }
      });

      if (!res.ok) {
        return { isLive: false, viewers: 0, error: `Profilul ${username} nu a fost găsit` };
      }

      const data = await res.json();

      return {
        success: true,
        platform: 'smilelive',
        username: username,
        isLive: data.data?.stream?.is_active || false,
        viewers: data.data?.stream?.current_viewers || 0,
        diamondsReceived: data.data?.wallet?.total_gifts || 0,
        avatar: data.data?.user?.avatar_url || ''
      };
    } catch (error) {
      console.error("Eroare Acoffee (SmileLive Platform):", error.message);
      return { isLive: false, viewers: 0, success: false, error: error.message };
    }
  }
}
