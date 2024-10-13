const CACHE_KEY = 'github_repos';
const CACHE_EXPIRY = 60 * 60 * 1000;

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  html_url: string;
}

const getCachedData = (): GitHubRepo[] | null => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;

    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return data as GitHubRepo[];
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }
  return null;
};

const setCache = (data: GitHubRepo[]) => {
  try {
    const cacheEntry = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error setting localStorage cache:', error);
  }
};

const fetchWithRetry = async (url: string, retries = 3, backoff = 300): Promise<Response> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying fetch... attempts left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, retries - 1, backoff * 2);
    }
    throw error;
  }
};

export const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
  const cachedData = getCachedData();
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetchWithRetry('https://api.github.com/users/shawnkhoffman/repos');
    const data: GitHubRepo[] = await response.json();
    
    setCache(data);
    return data;
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    throw error;
  }
};