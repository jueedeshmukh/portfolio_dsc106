import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

const projects = await fetchJSON('./lib/projects.json');
const latestProjects = Array.isArray(projects) ? projects.slice(0, 3) : [];

const projectsContainer = document.querySelector('.projects');
renderProjects(latestProjects, projectsContainer, 'h2');

const githubData = await fetchGitHubData('jueedeshmukh');
const profileStats = document.querySelector('#profile-stats');

if (profileStats && githubData) {
  profileStats.innerHTML = `
        <div class="stats-cards">
          <div class="stat-card" tabindex="0">
            <div class="stat-card-inner">
              <div class="stat-card-front">Public Repos</div>
              <div class="stat-card-back">${githubData.public_repos}</div>
            </div>
          </div>
          <div class="stat-card" tabindex="0">
            <div class="stat-card-inner">
              <div class="stat-card-front">Public Gists</div>
              <div class="stat-card-back">${githubData.public_gists}</div>
            </div>
          </div>
          <div class="stat-card" tabindex="0">
            <div class="stat-card-inner">
              <div class="stat-card-front">Followers</div>
              <div class="stat-card-back">${githubData.followers}</div>
            </div>
          </div>
          <div class="stat-card" tabindex="0">
            <div class="stat-card-inner">
              <div class="stat-card-front">Following</div>
              <div class="stat-card-back">${githubData.following}</div>
            </div>
          </div>
        </div>
    `;
}
