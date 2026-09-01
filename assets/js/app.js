const siteData = window.junetrailData || {};
const contentTypeMap = {
  news: 'data/news.json',
  vehicles: 'data/vehicles.json',
  products: 'data/products.json',
  guides: 'data/guides.json',
  engineering: 'data/engineering.json'
};

const categoryPlaceholders = {
  news: 'images/news/placeholder.svg',
  vehicles: 'images/vehicles/placeholder.svg',
  products: 'images/products/placeholder.svg',
  guides: 'images/guides/placeholder.svg',
  engineering: 'images/engineering/placeholder.svg'
};

function formatDate(dateString) {
  if (!dateString) {
    return '';
  }

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) {
    return dateString;
  }

  return parsedDate.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function getContentTypeLabel(type) {
  const labels = {
    news: 'News',
    vehicles: 'Vehicles',
    products: 'Product Reviews',
    guides: 'Guides',
    engineering: 'Engineering'
  };

  return labels[type] || type;
}

function getItemTitle(item) {
  return item.title || item.name || 'Untitled';
}

function getItemExcerpt(item) {
  return item.excerpt || item.description || '';
}

function getItemImage(item, type) {
  return item.featuredImage || item.image || item.gallery?.[0] || categoryPlaceholders[type] || 'images/placeholder.svg';
}

function getCardHref(type, itemId) {
  return `article.html?type=${type}&id=${itemId}`;
}

function createMetaRow(item, type) {
  const metaParts = [
    item.date ? formatDate(item.date) : '',
    item.readTime || '',
    item.rating ? `★ ${item.rating}` : '',
    item.price ? `From ${item.price}` : '',
    item.year ? `${item.year}` : '',
    item.brand && type === 'vehicles' ? item.brand : ''
  ].filter(Boolean);

  return `
    <div class="meta-row">
      ${metaParts.map((part) => `<span>${part}</span>`).join('')}
    </div>
  `;
}

function createCard(item, type) {
  const href = getCardHref(type, item.slug || item.id);
  const label = item.kicker || item.category || getContentTypeLabel(type);
  const title = getItemTitle(item);
  const excerpt = getItemExcerpt(item);
  const image = getItemImage(item, type);

  return `
    <article class="card">
      <a href="${href}" aria-label="Read ${title}">
        <div class="card-image" style="background-image: url('${image}');"></div>
      </a>
      <div class="card-body">
        <span class="eyebrow">${label}</span>
        <h3><a href="${href}">${title}</a></h3>
        <p>${excerpt}</p>
        ${createMetaRow(item, type)}
      </div>
    </article>
  `;
}

function createFeaturedStory(item) {
  const href = getCardHref('news', item.slug || item.id);
  const title = getItemTitle(item);
  const excerpt = getItemExcerpt(item);

  return `
    <article class="feature-story-inner">
      <div class="feature-image" style="background-image: url('${getItemImage(item, 'news')}');" aria-label="${title}"></div>
      <div class="feature-copy">
        <span class="eyebrow">Featured story</span>
        <h1>${title}</h1>
        <p>${excerpt}</p>
        <div class="feature-meta">
          <span>${formatDate(item.date)}</span>
          <span>${item.author || 'JUNE TRAIL'}</span>
          <span>${item.readTime || 'Quick read'}</span>
        </div>
        <div style="margin-top: 22px;">
          <a class="primary-button" href="${href}">Read article</a>
        </div>
      </div>
    </article>
  `;
}

function createSpecList(specs) {
  if (!specs) {
    return '';
  }

  return `
    <ul class="spec-list">
      ${Object.entries(specs)
        .map(([key, value]) => `<li><span>${key}</span><strong>${value}</strong></li>`)
        .join('')}
    </ul>
  `;
}

async function loadContentData(type) {
  try {
    const response = await fetch(`data/${type}.json`);
    if (!response.ok) {
      return [];
    }

    const json = await response.json();
    return Array.isArray(json) ? json : json.items || [];
  } catch (error) {
    return [];
  }
}

async function ensureSiteData() {
  if (window.junetrailData && Object.keys(window.junetrailData).length) {
    return window.junetrailData;
  }

  const data = {};
  for (const type of Object.keys(contentTypeMap)) {
    data[type] = await loadContentData(type);
  }

  window.junetrailData = data;
  return data;
}

function renderHomePage() {
  const newsList = siteData.news || [];
  const featuredNews = newsList.find((item) => item.featured) || newsList[0];

  if (!featuredNews) {
    return;
  }

  document.getElementById('featured-story').innerHTML = createFeaturedStory(featuredNews);
  document.getElementById('latest-news-list').innerHTML = newsList
    .slice(0, 4)
    .map((item) => createCard(item, 'news'))
    .join('');

  const vehicleList = siteData.vehicles || [];
  document.getElementById('featured-vehicles-list').innerHTML = vehicleList
    .slice(0, 4)
    .map((item) => createCard(item, 'vehicles'))
    .join('');

  const productList = siteData.products || [];
  document.getElementById('product-review-list').innerHTML = productList
    .slice(0, 4)
    .map((item) => createCard(item, 'products'))
    .join('');

  const guideList = siteData.guides || [];
  document.getElementById('guide-list').innerHTML = guideList
    .slice(0, 4)
    .map((item) => createCard(item, 'guides'))
    .join('');

  const engineeringList = siteData.engineering || [];
  document.getElementById('engineering-list').innerHTML = engineeringList
    .slice(0, 3)
    .map((item) => createCard(item, 'engineering'))
    .join('');
}

async function renderCategoryPage() {
  const type = document.body.dataset.content;
  const listTarget = document.getElementById('content-list');
  const titleTarget = document.getElementById('category-title');

  if (!type || !listTarget) {
    return;
  }

  await ensureSiteData();
  const items = (window.junetrailData[type] || []).filter((item) => item.published !== false);

  if (titleTarget) {
    titleTarget.textContent = getContentTypeLabel(type);
  }

  const renderItems = (filteredItems) => {
    if (!filteredItems.length) {
      listTarget.innerHTML = '<p>No items found.</p>';
      return;
    }

    listTarget.innerHTML = filteredItems.map((item) => createCard(item, type)).join('');
  };

  renderItems(items);

  const searchInput = document.getElementById('content-search');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const query = event.target.value.trim().toLowerCase();
      const filteredItems = items.filter((item) => {
        const haystack = [
          getItemTitle(item),
          getItemExcerpt(item),
          item.tags ? item.tags.join(' ') : '',
          item.author || '',
          item.brand || '',
          item.model || ''
        ].join(' ').toLowerCase();

        return haystack.includes(query);
      });

      renderItems(filteredItems);
    });
  }
}

async function getItemFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const id = params.get('id') || params.get('slug');

  if (!type || !id) {
    return null;
  }

  await ensureSiteData();
  const list = window.junetrailData[type] || [];

  return list.find((item) => item.id === id || item.slug === id) || null;
}

async function renderDetailPage() {
  const detailTarget = document.getElementById('detail-page');
  if (!detailTarget) {
    return;
  }

  const item = await getItemFromQuery();
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

  const itemTypeLabel = item.category || getContentTypeLabel(document.body.dataset.content || 'news');
  const bodyContent = Array.isArray(item.content) ? item.content : [item.content || item.description || item.excerpt];
  const bodyHtml = bodyContent.map((paragraph) => `<p>${paragraph}</p>`).join('');
  const specsHtml = item.specifications ? createSpecList(item.specifications) : item.specs ? createSpecList(item.specs) : '';

  const sidebarHtml = specsHtml
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
          <li><strong>Author</strong>${item.author || 'JUNE TRAIL'}</li>
          <li><strong>Read time</strong>${item.readTime || 'Quick read'}</li>
        </ul>
      </aside>
    `;

  const image = getItemImage(item, document.body.dataset.content || 'news');

  detailTarget.innerHTML = `
    <div class="detail-shell">
      <section class="detail-hero" style="background-image: url('${image}');">
        <div class="detail-copy">
          <span class="eyebrow">${itemTypeLabel}</span>
          <h1 class="detail-title">${getItemTitle(item)}</h1>
          <div class="feature-meta">
            <span>${formatDate(item.date)}</span>
            <span>${item.author || 'JUNE TRAIL'}</span>
            <span>${item.readTime || 'Quick read'}</span>
          </div>
        </div>
      </section>

      <div class="detail-grid">
        <article class="article-body">
          ${bodyHtml}
          ${item.amazonUrl ? `<div class="meta-panel" style="margin-top: 24px;"><h3>Affiliate note</h3><p>This review contains a placeholder Amazon link for future affiliate use. Replace this URL when ready.</p><p><a href="${item.amazonUrl}" target="_blank" rel="noreferrer">View on Amazon</a></p></div>` : ''}
          ${item.affiliateDisclosure ? `<p><strong>Affiliate disclosure:</strong> ${item.affiliateDisclosure}</p>` : ''}
        </article>
        ${sidebarHtml}
      </div>
    </div>
  `;
}

async function initSite() {
  if (document.body.dataset.page === 'home') {
    await ensureSiteData();
    renderHomePage();
  }

  if (document.body.dataset.page === 'detail') {
    await renderDetailPage();
  }

  if (document.body.dataset.page === 'list') {
    await renderCategoryPage();
  }
}

document.addEventListener('DOMContentLoaded', initSite);
