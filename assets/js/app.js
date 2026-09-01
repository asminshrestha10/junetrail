const siteData = window.junetrailData;

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function getCardHref(type, itemId) {
  return `article.html?type=${type}&id=${itemId}`;
}

function createMetaRow(item, type) {
  const metaParts = [
    formatDate(item.date),
    item.readTime ? item.readTime : '',
    item.rating ? `★ ${item.rating}` : '',
    item.price ? `From ${item.price}` : ''
  ].filter(Boolean);

  return `
    <div class="meta-row">
      ${metaParts.map((part) => `<span>${part}</span>`).join('')}
    </div>
  `;
}

function createCard(item, type) {
  const href = getCardHref(type, item.id);
  const label = item.kicker || item.category || type;

  return `
    <article class="card">
      <a href="${href}" aria-label="Read ${item.title}">
        <div class="card-image" style="background-image: url('${item.image}');"></div>
      </a>
      <div class="card-body">
        <span class="eyebrow">${label}</span>
        <h3><a href="${href}">${item.title}</a></h3>
        <p>${item.excerpt}</p>
        ${createMetaRow(item, type)}
      </div>
    </article>
  `;
}

function createFeaturedStory(item) {
  const href = getCardHref('news', item.id);

  return `
    <article class="feature-story-inner">
      <div class="feature-image" style="background-image: url('${item.image}');" aria-label="${item.title}"></div>
      <div class="feature-copy">
        <span class="eyebrow">Featured story</span>
        <h1>${item.title}</h1>
        <p>${item.excerpt}</p>
        <div class="feature-meta">
          <span>${formatDate(item.date)}</span>
          <span>${item.author}</span>
          <span>${item.readTime}</span>
        </div>
        <div style="margin-top: 22px;">
          <a class="primary-button" href="${href}">Read article</a>
        </div>
      </div>
    </article>
  `;
}

function createSpecList(specs) {
  return `
    <ul class="spec-list">
      ${Object.entries(specs)
        .map(([key, value]) => `<li><span>${key}</span><strong>${value}</strong></li>`)
        .join('')}
    </ul>
  `;
}

function renderHomePage() {
  const featuredNews = siteData.news.find((item) => item.featured) || siteData.news[0];

  document.getElementById('featured-story').innerHTML = createFeaturedStory(featuredNews);
  document.getElementById('latest-news-list').innerHTML = siteData.news
    .slice(0, 4)
    .map((item) => createCard(item, 'news'))
    .join('');

  document.getElementById('featured-vehicles-list').innerHTML = siteData.vehicles
    .slice(0, 4)
    .map((item) => createCard(item, 'vehicles'))
    .join('');

  document.getElementById('product-review-list').innerHTML = siteData.products
    .slice(0, 4)
    .map((item) => createCard(item, 'products'))
    .join('');

  document.getElementById('guide-list').innerHTML = siteData.guides
    .slice(0, 4)
    .map((item) => createCard(item, 'guides'))
    .join('');

  document.getElementById('engineering-list').innerHTML = siteData.engineering
    .slice(0, 3)
    .map((item) => createCard(item, 'engineering'))
    .join('');
}

function getItemFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const id = params.get('id');

  if (!type || !id || !siteData[type]) {
    return null;
  }

  return siteData[type].find((item) => item.id === id) || null;
}

function renderDetailPage() {
  const detailTarget = document.getElementById('detail-page');
  if (!detailTarget) {
    return;
  }

  const item = getItemFromQuery();
  if (!item) {
    detailTarget.innerHTML = `
      <div class="detail-shell">
        <div class="article-body" style="padding: 32px;">
          <h2>Article not found</h2>
          <p>The article you requested no longer exists or the link is incomplete.</p>
          <p><a href="index.html" class="text-link">Return to the homepage</a></p>
        </div>
      </div>
    `;
    return;
  }

  const itemTypeLabel = item.category || 'Article';
  const bodyHtml = item.body.map((paragraph) => `<p>${paragraph}</p>`).join('');
  const specsHtml = item.specs ? createSpecList(item.specs) : '';

  const sidebarHtml = item.specs
    ? `
      <aside class="meta-panel">
        <h3>Specifications</h3>
        ${specsHtml}
      </aside>
    `
    : `
      <aside class="meta-panel">
        <h3>Quick facts</h3>
        <ul>
          <li><strong>Category</strong>${itemTypeLabel}</li>
          <li><strong>Author</strong>${item.author}</li>
          <li><strong>Read time</strong>${item.readTime || 'Quick read'}</li>
        </ul>
      </aside>
    `;

  detailTarget.innerHTML = `
    <div class="detail-shell">
      <section class="detail-hero" style="background-image: url('${item.image}');">
        <div class="detail-copy">
          <span class="eyebrow">${itemTypeLabel}</span>
          <h1 class="detail-title">${item.title}</h1>
          <div class="feature-meta">
            <span>${formatDate(item.date)}</span>
            <span>${item.author}</span>
            <span>${item.readTime || 'Quick read'}</span>
          </div>
        </div>
      </section>

      <div class="detail-grid">
        <article class="article-body">
          ${bodyHtml}
        </article>
        ${sidebarHtml}
      </div>
    </div>
  `;
}

function initSite() {
  if (document.body.dataset.page === 'home') {
    renderHomePage();
  }

  if (document.body.dataset.page === 'detail') {
    renderDetailPage();
  }
}

document.addEventListener('DOMContentLoaded', initSite);
