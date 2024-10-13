export const fetchGitHubRepos = async () => {
    const response = await fetch('https://api.github.com/users/shawnkhoffman/repos');
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    return await response.json();
  };