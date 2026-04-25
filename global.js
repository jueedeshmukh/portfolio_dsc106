console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: 'index.html', title: 'Home' },
  { url: 'projects/index.html', title: 'Projects' },
  { url: 'resume/index.html', title: 'Resume' },
  { url: 'contact/index.html', title: 'Contact' },
  { url: 'https://github.com/jueedeshmukh', title: 'GitHub' },
];

// Support both module imports and direct <script type="module"> loading.
// When imported as a module, document.currentScript is null, so use import.meta.url.
let scriptURL = new URL(
  (typeof import.meta !== 'undefined' && import.meta.url) ||
    document.currentScript?.src ||
    location.href,
);
let siteRoot = new URL('.', scriptURL);

let nav = document.createElement('nav');
document.body.prepend(nav);

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
`,
);

let select = document.querySelector('.color-scheme select');

if ('colorScheme' in localStorage) {
  let savedColorScheme = localStorage.colorScheme;
  document.documentElement.style.setProperty('color-scheme', savedColorScheme);
  select.value = savedColorScheme;
}

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
});

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  let isExternal = url.startsWith('http');

  url = !isExternal ? new URL(url, siteRoot).href : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname,
  );

  let isExternalHost = a.host !== location.host;
  if (isExternalHost) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }

  nav.append(a);
}

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  const headingTag = /^h[1-6]$/i.test(headingLevel)
    ? headingLevel.toLowerCase()
    : 'h2';

  if (!(containerElement instanceof Element)) return;
  if (!Array.isArray(project)) project = [];

  containerElement.innerHTML = '';
  for (const proj of project) {
    const article = document.createElement('article');
    article.innerHTML = `
    <${headingTag}>${proj.title}</${headingTag}>
    <img src="${proj.image}" alt="${proj.title}">
    <p>${proj.description}</p>
`;
    containerElement.appendChild(article);
  }
}
