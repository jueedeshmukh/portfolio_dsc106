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

let scriptURL = new URL(document.currentScript.src);
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