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

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);


// step 1.4
let rolledData = d3.rollup(
  projects,
  (v) => v.length, // count the number of projects in each year
  (d) => d.year // group by year
);
let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));

let colors = d3.scaleOrdinal(d3.schemeTableau10);

arcs.forEach((arc, idx) => {
  d3.select('svg')
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(idx));
});

let legend = d3.select('.legend');
data.forEach((d, idx) => {
  legend
    .append('li')
    .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
});
