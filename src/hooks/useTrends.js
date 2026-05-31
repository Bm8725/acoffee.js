import { useState, useEffect } from 'react';

// Hook pentru extragerea automată a videoclipurilor de tip Trend
export function useTrends(clientInstance, hashtag = 'fyp') {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clientInstance?.tiktok) return;

    setLoading(true);
    clientInstance.tiktok.trending(hashtag)
      .then(data => {
        setVideos(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [clientInstance, hashtag]);

  return { videos, loading, error };
}

// Hook pentru extragerea profilului de creator
export function useProfile(clientInstance) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientInstance?.tiktok) return;

    clientInstance.tiktok.profile()
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [clientInstance]);

  return { profile, loading };
}
