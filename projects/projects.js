import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
console.log('projects data:', projects);

const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle && Array.isArray(projects)) {
  projectsTitle.textContent = `Personal Projects (${projects.length})`;
}

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// Expose for browser-console testing (modules don't add names to global scope).
window.renderProjects = renderProjects;
window.projectsData = projects;
window.projectsContainer = projectsContainer;

let arcGenerator = d3.arc().innerRadius(10).outerRadius(50);
