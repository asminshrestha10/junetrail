let siteData = window.junetrailData || {};
const SITE_BASE_URL = 'https://asminshrestha10.github.io/junetrail';
const contentTypeMap = {
  news: 'data/news.json',
  blogs: 'data/blogs.json',
  vehicles: 'data/vehicles.json',
  products: 'data/products.json',
  guides: 'data/guides.json',
  engineering: 'data/engineering.json'
};

const categoryPlaceholders = {
  news: 'images/news/placeholder.svg',
  blogs: 'images/blogs/placeholder.svg',
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

function getPageUrlForItem(type, item) {
  const itemId = item.slug || item.id || 'item';
  const query = new URLSearchParams({ type, id: itemId });
  const currentPath = window.location.pathname || '/junetrail/';
  const url = new URL(`${currentPath}?${query.toString()}`, SITE_BASE_URL);
  return url.toString();
}

function getSeoImageUrl(imagePath) {
  if (!imagePath) {
    return `${SITE_BASE_URL}/images/news/placeholder.svg`;
  }

  return new URL(imagePath, `${SITE_BASE_URL}/`).toString();
}

function getImageAltText(item, fallbackTitle) {
  if (item && item.imageAlt) {
    return item.imageAlt;
  }

  if (fallbackTitle) {
    return `${fallbackTitle} cover image`;
  }

  return 'JUNE TRAIL article cover image';
}

function getSeoTitle(item, type) {
  if (item && item.seoTitle) {
    return item.seoTitle;
  }

  const pageTitle = getItemTitle(item) || 'Article';

  if (type === 'engineering') {
    return `${pageTitle} | JUNE TRAIL Engineering`;
  }

  return `${pageTitle} | JUNE TRAIL`;
}

function getMetaDescription(item) {
  return item && (item.metaDescription || item.excerpt || 'JUNE TRAIL articles and insights for Australian 4x4, touring and ute culture.');
}

function setMetaTag(attr, key, value, attrValue = 'content') {
  let tag = document.head.querySelector(`${attr}[${key}="${value}"]`);
  if (!tag) {
    tag = document.createElement(attr === 'meta' ? 'meta' : attr);
    tag.setAttribute(key, value);
    document.head.appendChild(tag);
  }
  tag.setAttribute(attrValue, value);
}

function ensureMetaTag(name, content, propertyName = 'name') {
  const selector = propertyName === 'name' ? `meta[name="${name}"]` : `meta[property="${name}"]`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(propertyName, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function updateSeoMetadata({ title, description, imageUrl, pageUrl, imageAlt, type = 'website' }) {
  document.title = title;
  ensureMetaTag('description', description);
  ensureMetaTag('og:title', title, 'property');
  ensureMetaTag('og:description', description, 'property');
  ensureMetaTag('og:image', imageUrl, 'property');
  ensureMetaTag('og:url', pageUrl, 'property');
  ensureMetaTag('og:type', type, 'property');
  ensureMetaTag('twitter:card', 'summary_large_image', 'name');
  ensureMetaTag('twitter:title', title, 'name');
  ensureMetaTag('twitter:description', description, 'name');
  ensureMetaTag('twitter:image', imageUrl, 'name');
  ensureMetaTag('og:image:alt', imageAlt || title, 'property');
  ensureMetaTag('twitter:image:alt', imageAlt || title, 'name');

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = pageUrl;
}

function createJsonLd(item, type) {
  const itemTitle = getItemTitle(item);
  const articleType = type === 'news' ? 'NewsArticle' : type === 'blogs' ? 'BlogPosting' : type === 'vehicles' ? 'Vehicle' : type === 'products' ? 'Product' : 'Article';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': articleType,
    headline: itemTitle,
    description: getMetaDescription(item),
    url: getPageUrlForItem(type, item),
    image: getSeoImageUrl(getItemImage(item, type)),
    author: {
      '@type': 'Organization',
      name: item.author || 'JUNE TRAIL'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getPageUrlForItem(type, item)
    }
  };

  if (type === 'vehicles' || type === 'products') {
    jsonLd.name = itemTitle;
    if (item.brand) {
      jsonLd.brand = { '@type': 'Brand', name: item.brand };
    }
    if (item.model) {
      jsonLd.model = item.model;
    }
    if (item.category) {
      jsonLd.category = item.category;
    }
    if (type === 'products' && item.price) {
      jsonLd.offers = {
        '@type': 'Offer',
        priceCurrency: 'AUD',
        price: item.price.replace(/[^0-9.]/g, '') || undefined
      };
    }
  } else {
    jsonLd.datePublished = item.date || undefined;
    jsonLd.dateModified = item.date || undefined;
    jsonLd.articleSection = item.category || getContentTypeLabel(type);
  }

  const existingScript = document.getElementById('junetrail-json-ld');
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.id = 'junetrail-json-ld';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}

function getContentTypeLabel(type) {
  const labels = {
    news: 'News',
    blogs: 'Blogs',
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
    item.author ? item.author : '',
    item.readTime || '',
    item.difficulty && type === 'guides' ? `Difficulty: ${item.difficulty}` : '',
    item.estimatedTime && type === 'guides' ? `${item.estimatedTime}` : '',
    item.rating ? `★ ${item.rating}` : '',
    item.price ? `From ${item.price}` : '',
    item.year ? `${item.year}` : '',
    item.brand && (type === 'vehicles' || type === 'products') ? item.brand : '',
    item.model && type === 'vehicles' ? item.model : '',
    item.category && (type === 'vehicles' || type === 'products') ? item.category : ''
  ].filter(Boolean);

  return `
    <div class="meta-row">
      ${metaParts.map((part) => `<span>${part}</span>`).join('')}
    </div>
  `;
}

function formatEngineeringDetailLabel(label) {
  const friendlyLabels = {
    Focus: 'Engineering Focus',
    'Why It Matters': 'Why It Matters',
    'Why it matters': 'Why It Matters',
    'Key takeaway': 'Key takeaway',
    'Main takeaway': 'Main takeaway'
  };

  return friendlyLabels[label] || label;
}

function createCard(item, type) {
  const href = getCardHref(type, item.slug || item.id);
  const label = item.kicker || item.category || getContentTypeLabel(type);
  const title = getItemTitle(item);
  const excerpt = getItemExcerpt(item);
  const image = getItemImage(item, type);
  const imageAlt = getImageAltText(item, title);

  return `
    <article class="card">
      <a href="${href}" aria-label="Read ${title}">
        <div class="card-image" style="background-image: url('${image}');" role="img" aria-label="${imageAlt}"></div>
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
  const imageAlt = getImageAltText(item, title);

  return `
    <article class="feature-story-inner">
      <div class="feature-image" style="background-image: url('${getItemImage(item, 'news')}');" aria-label="${imageAlt}" role="img"></div>
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
    siteData = window.junetrailData;
    return siteData;
  }

  const data = {};
  for (const type of Object.keys(contentTypeMap)) {
    data[type] = await loadContentData(type);
  }

  window.junetrailData = data;
  siteData = data;
  return data;
}

function getVisibleItems(items = []) {
  return items.filter((item) => item && item.published !== false);
}

function getFeaturedOrFallback(items = [], limit = 4) {
  const visibleItems = getVisibleItems(items);
  const featuredItems = visibleItems.filter((item) => item.featured === true);
  const remainingItems = visibleItems.filter((item) => item.featured !== true);
  const selectedItems = [...featuredItems, ...remainingItems].slice(0, limit);

  return selectedItems;
}

function renderHomePage() {
  const newsList = getVisibleItems(siteData.news || []);
  const featuredNews = getFeaturedOrFallback(newsList, 1)[0] || newsList[0];

  if (!featuredNews) {
    return;
  }

  document.getElementById('featured-story').innerHTML = createFeaturedStory(featuredNews);
  document.getElementById('latest-news-list').innerHTML = getFeaturedOrFallback(newsList, 4)
    .map((item) => createCard(item, 'news'))
    .join('');

  const blogList = getFeaturedOrFallback(siteData.blogs || [], 4);
  const blogContainer = document.getElementById('blog-list');
  if (blogContainer) {
    blogContainer.innerHTML = blogList
      .map((item) => createCard(item, 'blogs'))
      .join('');
  }

  const vehicleList = getFeaturedOrFallback(siteData.vehicles || [], 4);
  document.getElementById('featured-vehicles-list').innerHTML = vehicleList
    .map((item) => createCard(item, 'vehicles'))
    .join('');

  const productList = getFeaturedOrFallback(siteData.products || [], 4);
  document.getElementById('product-review-list').innerHTML = productList
    .map((item) => createCard(item, 'products'))
    .join('');

  const guideList = getFeaturedOrFallback(siteData.guides || [], 4);
  document.getElementById('guide-list').innerHTML = guideList
    .map((item) => createCard(item, 'guides'))
    .join('');

  const engineeringList = getFeaturedOrFallback(siteData.engineering || [], 4);
  document.getElementById('engineering-list').innerHTML = engineeringList
    .map((item) => createCard(item, 'engineering'))
    .join('');
}

function updateCategorySeo(type) {
  const typeLabel = getContentTypeLabel(type);
  const pageTitles = {
    news: 'News | JUNE TRAIL',
    blogs: 'Blogs | JUNE TRAIL',
    vehicles: 'Vehicles | JUNE TRAIL',
    products: 'Product Reviews | JUNE TRAIL',
    guides: 'Guides | JUNE TRAIL',
    engineering: 'Engineering | JUNE TRAIL'
  };

  const descriptionMap = {
    news: 'Latest Australian 4x4, ute and touring news from JUNE TRAIL.',
    blogs: 'Long-form 4x4 and touring insights and practical stories from JUNE TRAIL.',
    vehicles: 'Vehicle reviews and buyer guides for Australian 4x4 and ute drivers.',
    products: 'Product reviews and gear recommendations for touring, recovery and daily 4x4 use.',
    guides: 'Practical guides for 4x4 owners, touring enthusiasts and ute buyers in Australia.',
    engineering: 'Engineering-focused explainers and technical insights for 4x4, touring and vehicle capability.'
  };

  const pageUrl = new URL(window.location.href).toString();
  document.title = pageTitles[type] || `${typeLabel} | JUNE TRAIL`;
  ensureMetaTag('description', descriptionMap[type] || `${typeLabel} coverage from JUNE TRAIL.`);
  ensureMetaTag('og:title', document.title, 'property');
  ensureMetaTag('og:description', descriptionMap[type] || `${typeLabel} coverage from JUNE TRAIL.`, 'property');
  ensureMetaTag('og:url', pageUrl, 'property');
  ensureMetaTag('og:type', 'website', 'property');
  ensureMetaTag('twitter:card', 'summary_large_image', 'name');
  ensureMetaTag('twitter:title', document.title, 'name');
  ensureMetaTag('twitter:description', descriptionMap[type] || `${typeLabel} coverage from JUNE TRAIL.`, 'name');

  const canonical = document.head.querySelector('link[rel="canonical"]') || document.createElement('link');
  if (!canonical.parentNode) {
    document.head.appendChild(canonical);
  }
  canonical.rel = 'canonical';
  canonical.href = pageUrl;
}

async function renderCategoryPage() {
  const type = document.body.dataset.content;
  const listTarget = document.getElementById('content-list');
  const titleTarget = document.getElementById('category-title');

  if (!type || !listTarget) {
    return;
  }

  await ensureSiteData();
  const items = (window.junetrailData[type] || []).filter((item) => item.published === true);

  updateCategorySeo(type);

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
  const list = (window.junetrailData[type] || []).filter((item) => item.published === true);

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
  const tagsHtml = Array.isArray(item.tags) && item.tags.length
    ? `<div style="margin-top: 20px; display: flex; flex-wrap: wrap; gap: 8px;">
        ${item.tags.map((tag) => `<span style="display:inline-block; padding: 6px 10px; border:1px solid #d8d8d8; border-radius:999px; background:#f6f0ea; color:#1e1e1e; font-size:0.75rem; font-weight:700; letter-spacing:0.04em; text-transform:lowercase;">${tag}</span>`).join('')}
      </div>`
    : '';

  const guideExtras = {
    Author: item.author || 'JUNE TRAIL',
    Difficulty: item.difficulty || '',
    'Estimated time': item.estimatedTime || '',
    Date: item.date ? formatDate(item.date) : ''
  };

  const isProduct = (document.body.dataset.content || 'news') === 'products' || Boolean(item.brand && item.category && (item.price || item.pros || item.cons || item.affiliateUrl || item.amazonUrl));
  const isEngineering = (document.body.dataset.content || 'news') === 'engineering';

  const productProsHtml = Array.isArray(item.pros) && item.pros.length
    ? `<div style="margin-top: 24px;"><h3>Pros</h3><ul>${item.pros.map((point) => `<li>${point}</li>`).join('')}</ul></div>`
    : '';
  const productConsHtml = Array.isArray(item.cons) && item.cons.length
    ? `<div style="margin-top: 18px;"><h3>Cons</h3><ul>${item.cons.map((point) => `<li>${point}</li>`).join('')}</ul></div>`
    : '';
  const affiliateUrl = item.affiliateUrl || item.amazonUrl || '';
  const affiliateButton = affiliateUrl
    ? `<p><a class="primary-button" href="${affiliateUrl}" target="_blank" rel="noopener noreferrer">View retailer</a></p>`
    : '<p>Affiliate link to be added later.</p>';
  const retailerText = item.retailer || 'Retailer TBA';
  const productDisclosure = item.affiliateDisclosure || 'JUNE TRAIL may earn a commission from qualifying purchases made through affiliate links. This does not affect our editorial independence or our product assessment.';

  const productSummaryHtml = isProduct
    ? `
      <div class="meta-panel" style="margin-top: 24px;">
        <h3>Product details</h3>
        <ul>
          <li><strong>Brand</strong>${item.brand || 'JUNE TRAIL'}</li>
          <li><strong>Category</strong>${item.category || 'Product'}</li>
          <li><strong>Price</strong>${item.price || 'Price available on retailer site'}</li>
          <li><strong>Retailer</strong>${retailerText}</li>
        </ul>
        ${affiliateButton}
        <p style="margin-top: 14px;"><strong>Affiliate disclosure:</strong> ${productDisclosure}</p>
      </div>
      ${productProsHtml}
      ${productConsHtml}
      ${Array.isArray(item.tags) && item.tags.length ? `<div style="margin-top: 18px;"><h3>Tags</h3>${tagsHtml}</div>` : ''}
    `
    : '';

  const vehicleFacts = {
    Year: item.year || '',
    Model: item.model || '',
    Brand: item.brand || '',
    Engine: item.engine || '',
    Transmission: item.transmission || '',
    Drivetrain: item.drivetrain || '',
    'Towing capacity': item.towingCapacity || '',
    Payload: item.payload || '',
    Power: item.power || '',
    Torque: item.torque || ''
  };

  const factsFromSpecs = item.specifications ? { ...item.specifications } : {};
  const detailFacts = Object.fromEntries(
    Object.entries({ ...vehicleFacts, ...factsFromSpecs }).filter(([, value]) => value !== '' && value !== undefined && value !== null)
  );
  const specsHtml = Object.keys(detailFacts).length ? createSpecList(detailFacts) : item.specs ? createSpecList(item.specs) : '';

  const engineeringDetailsHtml = isEngineering && item.engineeringDetails && Object.keys(item.engineeringDetails).length
    ? `
      <aside class="meta-panel">
        <h3>Engineering details</h3>
        <ul>
          ${Object.entries(item.engineeringDetails)
            .map(([key, value]) => `<li><strong>${formatEngineeringDetailLabel(key)}</strong>${value}</li>`)
            .join('')}
        </ul>
      </aside>
    `
    : '';

  const guideFactsHtml = (document.body.dataset.content || 'news') === 'guides'
    ? `
      <aside class="meta-panel">
        <h3>Quick facts</h3>
        <ul>
          <li><strong>Category</strong>${itemTypeLabel}</li>
          <li><strong>Author</strong>${item.author || 'JUNE TRAIL'}</li>
          <li><strong>Difficulty</strong>${item.difficulty || 'Beginner friendly'}</li>
          <li><strong>Estimated time</strong>${item.estimatedTime || 'Flexible'}</li>
          <li><strong>Date</strong>${item.date ? formatDate(item.date) : 'No date'}</li>
        </ul>
      </aside>
    `
    : isEngineering
      ? engineeringDetailsHtml || `
        <aside class="meta-panel">
          <h3>Quick facts</h3>
          <ul>
            <li><strong>Category</strong>${itemTypeLabel}</li>
            <li><strong>Author</strong>${item.author || 'JUNE TRAIL'}</li>
            <li><strong>Read time</strong>${item.readTime || 'Quick read'}</li>
          </ul>
        </aside>
      `
      : specsHtml
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
  const imageAlt = getImageAltText(item, getItemTitle(item));
  const detailPageUrl = getPageUrlForItem(document.body.dataset.content || 'news', item);
  const seoTitle = getSeoTitle(item, document.body.dataset.content || 'news');
  const seoDescription = getMetaDescription(item);

  updateSeoMetadata({
    title: seoTitle,
    description: seoDescription,
    imageUrl: getSeoImageUrl(image),
    pageUrl: detailPageUrl,
    imageAlt,
    type: 'article'
  });
  createJsonLd(item, document.body.dataset.content || 'news');

  detailTarget.innerHTML = `
    <div class="detail-shell">
      <section class="detail-hero" style="background-image: url('${image}');" role="img" aria-label="${imageAlt}">
        <div class="detail-copy">
          <span class="eyebrow">${itemTypeLabel}</span>
          <h1 class="detail-title">${getItemTitle(item)}</h1>
          <div class="feature-meta">
            <span>${item.date ? formatDate(item.date) : 'Date unavailable'}</span>
            <span>${item.author || 'JUNE TRAIL'}</span>
            <span>${item.readTime || item.estimatedTime || 'Quick read'}</span>
            ${item.difficulty ? `<span>Difficulty: ${item.difficulty}</span>` : ''}
          </div>
        </div>
      </section>

      <div class="detail-grid">
        <article class="article-body">
          ${bodyHtml}
          ${isProduct ? productSummaryHtml : tagsHtml}
          ${item.amazonUrl && !isProduct ? `<div class="meta-panel" style="margin-top: 24px;"><h3>Affiliate note</h3><p>This review contains a placeholder Amazon link for future affiliate use. Replace this URL when ready.</p><p><a href="${item.amazonUrl}" target="_blank" rel="noreferrer">View on Amazon</a></p></div>` : ''}
          ${item.affiliateDisclosure && !isProduct ? `<p><strong>Affiliate disclosure:</strong> ${item.affiliateDisclosure}</p>` : ''}
        </article>
        ${guideFactsHtml}
      </div>
    </div>
  `;
}

async function initSite() {
  if (document.body.dataset.page === 'home') {
    const homeUrl = new URL(window.location.href).toString();
    document.title = 'JUNE TRAIL | Australian 4x4, Ute, Touring and Gear News';
    ensureMetaTag('description', 'JUNE TRAIL is an Australian automotive magazine featuring 4x4 vehicles, utes, product reviews, guides, engineering stories and news.');
    ensureMetaTag('og:title', document.title, 'property');
    ensureMetaTag('og:description', 'JUNE TRAIL is an Australian automotive magazine featuring 4x4 vehicles, utes, product reviews, guides, engineering stories and news.', 'property');
    ensureMetaTag('og:url', homeUrl, 'property');
    ensureMetaTag('og:type', 'website', 'property');
    ensureMetaTag('twitter:card', 'summary_large_image', 'name');
    ensureMetaTag('twitter:title', document.title, 'name');
    ensureMetaTag('twitter:description', 'JUNE TRAIL is an Australian automotive magazine featuring 4x4 vehicles, utes, product reviews, guides, engineering stories and news.', 'name');
    const homeImage = `${SITE_BASE_URL}/images/news/placeholder.svg`;
    ensureMetaTag('og:image', homeImage, 'property');
    ensureMetaTag('twitter:image', homeImage, 'name');
    const canonical = document.head.querySelector('link[rel="canonical"]') || document.createElement('link');
    if (!canonical.parentNode) {
      document.head.appendChild(canonical);
    }
    canonical.rel = 'canonical';
    canonical.href = homeUrl;
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
