const CACHE_KEY = 'github_repos';
const CACHE_EXPIRY = 60 * 60 * 1000;

export const fetchGitHubRepos = async () => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return data;
    }
  }

  const response = await fetch('https://api.github.com/users/shawnkhoffman/repos');
  if (!response.ok) {
    throw new Error('Failed to fetch repositories');
  }
  const data = await response.json();
  
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  return data;
};