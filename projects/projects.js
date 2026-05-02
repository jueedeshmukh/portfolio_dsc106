import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
console.log('projects data:', projects);

const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle && Array.isArray(projects)) {
  projectsTitle.textContent = `Personal Projects (${projects.length})`;
}

const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');
let query = '';
let selectedIndex = -1;
let selectedYear = null;
let currentProjects = projects;

// Expose for browser-console testing (modules don't add names to global scope).
window.renderProjects = renderProjects;
window.projectsData = projects;
window.projectsContainer = projectsContainer;
window.selectedIndex = selectedIndex;
window.selectedYear = selectedYear;

const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
const colors = d3.scaleOrdinal(d3.schemeTableau10);

function renderPieChart(projectsGiven) {
  const newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  const newData = newRolledData.map(([year, count]) => ({
    value: count,
    label: year,
  }));

  selectedIndex = newData.findIndex((item) => item.label === selectedYear);
  if (selectedIndex === -1) {
    selectedYear = null;
  }
  window.selectedIndex = selectedIndex;
  window.selectedYear = selectedYear;

  const visibleProjects = selectedYear
    ? projectsGiven.filter((project) => project.year === selectedYear)
    : projectsGiven;

  projectsTitle.textContent = `Personal Projects (${visibleProjects.length})`;
  renderProjects(visibleProjects, projectsContainer, 'h2');

  const svg = d3.select('#projects-pie-plot');
  svg.selectAll('path').remove();

  const legend = d3.select('.legend');
  legend.selectAll('li').remove();

  const newSliceGenerator = d3.pie().value((d) => d.value);
  const newArcData = newSliceGenerator(newData);
  const newArcs = newArcData.map((d) => arcGenerator(d));

  newArcs.forEach((arc, idx) => {
    const year = newData[idx].label;
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx))
      .classed('selected', idx === selectedIndex)
      .on('click', () => {
        selectedYear = selectedYear === year ? null : year;
        renderPieChart(projectsGiven);
      });
  });

  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .classed('selected', idx === selectedIndex)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedYear = selectedYear === d.label ? null : d.label;
        renderPieChart(projectsGiven);
      });
  });
}

renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();
  currentProjects = projects.filter((project) => {
    const values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query);
  });
  renderPieChart(currentProjects);
});