const SECTION_ORDER = ['news', 'blogs', 'vehicles', 'products', 'guides', 'engineering'];

const sectionLabels = {
  dashboard: 'Dashboard',
  news: 'News',
  blogs: 'Blogs',
  vehicles: 'Vehicles',
  products: 'Products',
  guides: 'Guides',
  engineering: 'Engineering'
};

const ADMIN_API_BASE = window.JUNETRAIL_ADMIN_API || (
  window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8787'
    : 'https://junetrail-admin-worker.asminshrestha10.workers.dev'
);

const adminState = {
  selectedSection: 'dashboard',
  data: {},
  selectedId: null,
  authenticated: false
};

function setAuthMessage(message, isError = true) {
  const element = document.getElementById('auth-message');
  if (!element) return;
  element.textContent = message || '';
  element.style.color = isError ? '#b23a3a' : '#2e6e4b';
}

function setAuthView(isAuthenticated) {
  const authScreen = document.getElementById('auth-screen');
  const adminShell = document.getElementById('admin-shell');
  adminState.authenticated = isAuthenticated;

  authScreen.classList.toggle('hidden', isAuthenticated);
  adminShell.classList.toggle('hidden', !isAuthenticated);
}

async function apiFetch(path, options = {}) {
  const requestOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  };

  if (requestOptions.body && typeof requestOptions.body !== 'string' && !(requestOptions.body instanceof FormData)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  const response = await fetch(`${ADMIN_API_BASE}${path}`, requestOptions);
  const text = await response.text();
  let payload = {};
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (error) {
      payload = { error: 'Invalid server response.' };
    }
  }

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.');
  }

  return payload;
}

async function checkAuth() {
  try {
    const result = await apiFetch('/api/admin/session');
    if (result.authenticated) {
      setAuthView(true);
      await loadSectionData();
      renderDashboardSummary();
      selectSection('news');
      return;
    }
  } catch (error) {
    // ignore, login required
  }

  setAuthView(false);
}

async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');

  if (!username || !password) {
    setAuthMessage('Please enter both username and password.');
    return;
  }

  try {
    const result = await apiFetch('/api/admin/login', {
      method: 'POST',
      body: { username, password }
    });

    setAuthMessage('Login successful.', false);
    setAuthView(true);
    await loadSectionData();
    renderDashboardSummary();
    selectSection('news');
  } catch (error) {
    setAuthMessage(error.message || 'Login failed.');
  }
}

async function handleLogout() {
  try {
    await apiFetch('/api/admin/logout', { method: 'POST' });
  } catch (error) {
    // ignore logout failure and clear local state
  }

  setAuthView(false);
  setAuthMessage('You have been logged out.');
}

function getItemTitle(item) {
  if (!item) return 'Untitled';
  return item.title || item.name || item.slug || 'Untitled';
}

function getItemStatus(item) {
  if (item && item.published === false) {
    return 'Draft';
  }
  return 'Published';
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseFieldValue(value, fieldName) {
  if (fieldName === 'content' || fieldName === 'pros' || fieldName === 'cons') {
    if (!value || !String(value).trim()) return [];
    return String(value)
      .split(/\n+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  if (fieldName === 'tags') {
    if (!value || !String(value).trim()) return [];
    return String(value)
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (fieldName === 'specifications' || fieldName === 'engineeringDetails') {
    if (!value || !String(value).trim()) return {};
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  if (fieldName === 'featured' || fieldName === 'published') {
    return Boolean(value);
  }

  if (fieldName === 'year') {
    if (value === '' || value === null || value === undefined) return undefined;
    return Number(value);
  }

  return value;
}

function getFieldConfig(section) {
  const baseFields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'slug', label: 'Slug', type: 'text' },
    { name: 'category', label: 'Category', type: 'text' },
    { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
    { name: 'featuredImage', label: 'Featured Image', type: 'text' },
    { name: 'imageAlt', label: 'Image Alt Text', type: 'text' },
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'author', label: 'Author', type: 'text' },
    { name: 'readTime', label: 'Read Time', type: 'text' },
    { name: 'content', label: 'Content', type: 'textarea' },
    { name: 'seoTitle', label: 'SEO Title', type: 'text' },
    { name: 'metaDescription', label: 'Meta Description', type: 'textarea' },
    { name: 'tags', label: 'Tags', type: 'text' },
    { name: 'featured', label: 'Featured', type: 'checkbox' },
    { name: 'published', label: 'Published', type: 'checkbox' }
  ];

  const vehicleFields = [
    { name: 'name', label: 'Vehicle Name', type: 'text' },
    { name: 'brand', label: 'Brand', type: 'text' },
    { name: 'model', label: 'Model', type: 'text' },
    { name: 'year', label: 'Year', type: 'number' },
    { name: 'price', label: 'Price', type: 'text' },
    { name: 'engine', label: 'Engine', type: 'text' },
    { name: 'power', label: 'Power', type: 'text' },
    { name: 'torque', label: 'Torque', type: 'text' },
    { name: 'transmission', label: 'Transmission', type: 'text' },
    { name: 'drivetrain', label: 'Drivetrain', type: 'text' },
    { name: 'towingCapacity', label: 'Towing Capacity', type: 'text' },
    { name: 'payload', label: 'Payload', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'specifications', label: 'Specifications (JSON)', type: 'textarea' },
    { name: 'gallery', label: 'Gallery (comma separated)', type: 'text' }
  ];

  const productFields = [
    { name: 'name', label: 'Product Name', type: 'text' },
    { name: 'brand', label: 'Brand', type: 'text' },
    { name: 'category', label: 'Category', type: 'text' },
    { name: 'price', label: 'Price', type: 'text' },
    { name: 'rating', label: 'Rating', type: 'text' },
    { name: 'retailer', label: 'Retailer', type: 'text' },
    { name: 'affiliateUrl', label: 'Affiliate URL', type: 'text' },
    { name: 'featuredImage', label: 'Featured Image', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'pros', label: 'Pros', type: 'textarea' },
    { name: 'cons', label: 'Cons', type: 'textarea' },
    { name: 'engineeringOpinion', label: 'Engineering Opinion', type: 'textarea' },
    { name: 'affiliateDisclosure', label: 'Affiliate Disclosure', type: 'textarea' }
  ];

  const guideFields = [
    { name: 'difficulty', label: 'Difficulty', type: 'text' },
    { name: 'estimatedTime', label: 'Estimated Time', type: 'text' }
  ];

  const engineeringFields = [
    { name: 'engineeringDetails', label: 'Engineering Details (JSON)', type: 'textarea' }
  ];

  if (section === 'vehicles') {
    const vehicleFieldNames = new Set(['title', 'slug', 'category', 'excerpt', 'featuredImage', 'imageAlt', 'date', 'author', 'readTime', 'content', 'seoTitle', 'metaDescription', 'tags', 'featured', 'published']);
    return [...vehicleFields, ...baseFields.filter((field) => !vehicleFieldNames.has(field.name)), ...baseFields.filter((field) => vehicleFieldNames.has(field.name))];
  }

  if (section === 'products') {
    const productFieldNames = new Set(['title', 'slug', 'category', 'excerpt', 'featuredImage', 'imageAlt', 'date', 'author', 'readTime', 'content', 'seoTitle', 'metaDescription', 'tags', 'featured', 'published']);
    return [...productFields, ...baseFields.filter((field) => !productFieldNames.has(field.name)), ...baseFields.filter((field) => productFieldNames.has(field.name))];
  }

  if (section === 'guides') {
    const guideFieldNames = new Set(['title', 'category', 'excerpt', 'featuredImage', 'imageAlt', 'date', 'author', 'readTime', 'content', 'tags', 'featured', 'published']);
    return [...baseFields.filter((field) => !guideFieldNames.has(field.name)), ...guideFields, ...baseFields.filter((field) => guideFieldNames.has(field.name))];
  }

  if (section === 'engineering') {
    const engineeringFieldNames = new Set(['title', 'category', 'excerpt', 'featuredImage', 'imageAlt', 'date', 'author', 'readTime', 'content', 'tags', 'featured', 'published']);
    return [...baseFields.filter((field) => !engineeringFieldNames.has(field.name)), ...engineeringFields, ...baseFields.filter((field) => engineeringFieldNames.has(field.name))];
  }

  return baseFields;
}

function fieldValue(item, fieldName) {
  if (!item) return '';

  if (fieldName === 'content' && Array.isArray(item.content)) return item.content.join('\n\n');
  if (fieldName === 'gallery' && Array.isArray(item.gallery)) return item.gallery.join(', ');
  if (fieldName === 'specifications' && item.specifications && typeof item.specifications === 'object') return JSON.stringify(item.specifications, null, 2);
  if (fieldName === 'pros' && Array.isArray(item.pros)) return item.pros.join('\n');
  if (fieldName === 'cons' && Array.isArray(item.cons)) return item.cons.join('\n');
  if (fieldName === 'tags' && Array.isArray(item.tags)) return item.tags.join(', ');
  if (fieldName === 'engineeringDetails' && item.engineeringDetails && typeof item.engineeringDetails === 'object') return JSON.stringify(item.engineeringDetails, null, 2);
  if (fieldName === 'name' && !item.name && item.title) return item.title;
  return item[fieldName] ?? '';
}

function buildFormFields(section, item = null) {
  const fields = getFieldConfig(section);
  return fields.map((field) => {
    const value = fieldValue(item, field.name);
    const fieldClass = field.type === 'textarea' ? 'field full' : 'field';

    if (field.type === 'checkbox') {
      return `
        <div class="${fieldClass}">
          <label class="checkbox-row">
            <input type="checkbox" name="${field.name}" ${Boolean(value) ? 'checked' : ''} />
            <span>${field.label}</span>
          </label>
        </div>
      `;
    }

    const inputMarkup = field.type === 'textarea'
      ? `<textarea name="${field.name}" aria-label="${field.label}">${String(value)}</textarea>`
      : `<input type="${field.type}" name="${field.name}" value="${String(value).replace(/"/g, '&quot;')}" />`;

    return `
      <div class="${fieldClass}">
        <label for="${field.name}">${field.label}</label>
        ${inputMarkup}
      </div>
    `;
  }).join('');
}

function renderDashboardSummary() {
  const summaryEl = document.getElementById('content-summary');
  const summaryCards = SECTION_ORDER.map((section) => {
    const items = Array.isArray(adminState.data[section]) ? adminState.data[section] : [];
    return `
      <div class="summary-card" data-summary-section="${section}">
        <h3>${sectionLabels[section]}</h3>
        <div class="count">${items.length}</div>
      </div>
    `;
  }).join('');

  summaryEl.innerHTML = summaryCards;
  summaryEl.querySelectorAll('[data-summary-section]').forEach((card) => {
    card.addEventListener('click', () => selectSection(card.dataset.summarySection));
  });
}

function renderListing(section) {
  const container = document.getElementById('listing-container');
  const entries = Array.isArray(adminState.data[section]) ? adminState.data[section] : [];
  document.getElementById('list-title').textContent = sectionLabels[section];

  if (!entries.length) {
    container.innerHTML = '<div class="list-row"><div class="list-row-title">No items yet.</div></div>';
    return;
  }

  container.innerHTML = entries.map((item) => {
    const itemId = item.id || item.slug || createId(section);
    return `
      <div class="list-row" data-item-id="${itemId}">
        <div>
          <div class="list-row-title">${getItemTitle(item)}</div>
          <div class="list-row-meta">${getItemStatus(item)} · ${item.slug || 'no-slug'}</div>
        </div>
        <div class="list-row-meta">${item.featured ? 'Featured' : 'Standard'}</div>
        <div class="list-row-actions">
          <button class="small-action" data-action="edit" data-id="${itemId}" type="button">Edit</button>
          <button class="small-action ${item.published === false ? 'success' : ''}" data-action="publish-toggle" data-id="${itemId}" type="button">${item.published === false ? 'Publish' : 'Unpublish'}</button>
          <button class="small-action ${item.featured ? 'success' : ''}" data-action="feature-toggle" data-id="${itemId}" type="button">${item.featured ? 'Featured' : 'Feature'}</button>
          <button class="small-action danger" data-action="delete" data-id="${itemId}" type="button">Delete</button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('[data-action="edit"]').forEach((button) => {
    button.addEventListener('click', () => openEditor(section, button.dataset.id));
  });

  container.querySelectorAll('[data-action="publish-toggle"]').forEach((button) => {
    button.addEventListener('click', () => togglePublished(section, button.dataset.id));
  });

  container.querySelectorAll('[data-action="feature-toggle"]').forEach((button) => {
    button.addEventListener('click', () => toggleFeatured(section, button.dataset.id));
  });

  container.querySelectorAll('[data-action="delete"]').forEach((button) => {
    button.addEventListener('click', () => deleteItem(section, button.dataset.id));
  });
}

function selectSection(section) {
  adminState.selectedSection = section;
  adminState.selectedId = null;

  document.querySelectorAll('.nav-tab').forEach((button) => {
    button.classList.toggle('active', button.dataset.section === section);
  });

  document.querySelectorAll('.panel').forEach((panel) => panel.classList.remove('active-panel'));
  document.getElementById('section-heading').textContent = sectionLabels[section];

  if (section === 'dashboard') {
    document.getElementById('dashboard-view').classList.add('active-panel');
    return;
  }

  document.getElementById('list-view').classList.add('active-panel');
  renderListing(section);
}

function createBlankItem(section, itemId = null) {
  const baseItem = {
    id: itemId || createId(section),
    slug: '',
    category: sectionLabels[section],
    featured: false,
    published: true,
    date: new Date().toISOString().slice(0, 10),
    author: 'JUNE TRAIL',
    readTime: '5 min read',
    tags: []
  };

  if (section === 'news' || section === 'blogs' || section === 'guides' || section === 'engineering') {
    baseItem.title = '';
    baseItem.excerpt = '';
    baseItem.featuredImage = `images/${section}/placeholder.svg`;
    baseItem.content = [];
    baseItem.imageAlt = '';
  }

  if (section === 'vehicles') {
    baseItem.name = '';
    baseItem.brand = '';
    baseItem.model = '';
    baseItem.year = new Date().getFullYear();
    baseItem.price = '';
    baseItem.description = '';
    baseItem.featuredImage = 'images/vehicles/placeholder.svg';
    baseItem.gallery = ['images/vehicles/placeholder.svg'];
    baseItem.specifications = { Engine: '', Transmission: '', Drive: '', Towing: '' };
  }

  if (section === 'products') {
    baseItem.name = '';
    baseItem.brand = '';
    baseItem.category = 'Product';
    baseItem.price = '';
    baseItem.rating = '5.0';
    baseItem.retailer = 'Retailer TBA';
    baseItem.affiliateUrl = '';
    baseItem.featuredImage = 'images/products/placeholder.svg';
    baseItem.description = '';
    baseItem.pros = [];
    baseItem.cons = [];
    baseItem.engineeringOpinion = '';
    baseItem.affiliateDisclosure = 'JUNE TRAIL may earn a commission from qualifying purchases made through affiliate links. This does not affect our editorial independence or our product assessment.';
  }

  return baseItem;
}

function openEditor(section, itemId) {
  const entries = Array.isArray(adminState.data[section]) ? adminState.data[section] : [];
  const existingItem = entries.find((entry) => String(entry.id || entry.slug) === String(itemId));
  const targetItem = existingItem || createBlankItem(section, itemId);

  adminState.selectedId = targetItem.id || targetItem.slug || itemId;

  document.getElementById('form-heading').textContent = existingItem ? 'Edit content' : 'Add new content';
  document.getElementById('form-fields').innerHTML = buildFormFields(section, targetItem);

  document.querySelectorAll('.panel').forEach((panel) => panel.classList.remove('active-panel'));
  document.getElementById('editor-view').classList.add('active-panel');
}

function buildItemFromForm(section) {
  const form = document.getElementById('content-form');
  const formData = new FormData(form);
  const item = {};

  const fields = getFieldConfig(section);
  fields.forEach((field) => {
    const rawValue = formData.get(field.name);
    const value = parseFieldValue(rawValue, field.name);

    if (field.name === 'tags') {
      item.tags = value;
      return;
    }

    if (field.name === 'specifications' || field.name === 'engineeringDetails') {
      item[field.name] = value;
      return;
    }

    if (field.name === 'gallery') {
      item.gallery = String(rawValue || '').split(',').map((part) => part.trim()).filter(Boolean);
      return;
    }

    if (field.name === 'content' || field.name === 'pros' || field.name === 'cons') {
      item[field.name] = value;
      return;
    }

    if (field.name === 'featured' || field.name === 'published') {
      item[field.name] = Boolean(rawValue);
      return;
    }

    if (rawValue === null || rawValue === undefined || rawValue === '') {
      return;
    }

    item[field.name] = value;
  });

  if (!item.id && adminState.selectedId) {
    item.id = adminState.selectedId;
  }

  item.id = item.id || createId(section);

  if (!item.slug && (item.title || item.name)) {
    item.slug = String(item.title || item.name)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  if (!item.category) {
    item.category = sectionLabels[section];
  }

  if (section === 'news' || section === 'blogs' || section === 'guides' || section === 'engineering') {
    if (!item.featuredImage) item.featuredImage = `images/${section}/placeholder.svg`;
    if (!item.content) item.content = [];
  }

  return item;
}

async function saveForm(event) {
  event.preventDefault();
  const section = adminState.selectedSection;
  if (!section || section === 'dashboard') return;

  const item = buildItemFromForm(section);
  try {
    const method = adminState.selectedId ? 'PUT' : 'POST';
    const targetPath = adminState.selectedId
      ? `/api/admin/content/${section}/${adminState.selectedId}`
      : `/api/admin/content/${section}`;

    const result = await apiFetch(targetPath, {
      method,
      body: { item }
    });

    if (result && result.item) {
      const items = Array.isArray(adminState.data[section]) ? adminState.data[section] : [];
      const index = items.findIndex((entry) => String(entry.id || entry.slug) === String(result.item.id || result.item.slug));
      if (index >= 0) {
        items[index] = result.item;
      } else {
        items.push(result.item);
      }
      adminState.data[section] = items;
    }

    await loadSectionData();
    renderDashboardSummary();
    selectSection(section);
  } catch (error) {
    setAuthMessage(error.message || 'Could not save content.');
  }
}

async function togglePublished(section, itemId) {
  const items = Array.isArray(adminState.data[section]) ? adminState.data[section] : [];
  const item = items.find((entry) => String(entry.id || entry.slug) === String(itemId));
  if (!item) return;

  item.published = item.published === false;

  try {
    await apiFetch(`/api/admin/content/${section}/${itemId}`, {
      method: 'PUT',
      body: { item }
    });
    await loadSectionData();
    renderListing(section);
  } catch (error) {
    setAuthMessage(error.message || 'Could not update published status.');
  }
}

async function toggleFeatured(section, itemId) {
  const items = Array.isArray(adminState.data[section]) ? adminState.data[section] : [];
  const item = items.find((entry) => String(entry.id || entry.slug) === String(itemId));
  if (!item) return;

  item.featured = !item.featured;

  try {
    await apiFetch(`/api/admin/content/${section}/${itemId}`, {
      method: 'PUT',
      body: { item }
    });
    await loadSectionData();
    renderListing(section);
  } catch (error) {
    setAuthMessage(error.message || 'Could not update featured status.');
  }
}

async function deleteItem(section, itemId) {
  const shouldDelete = window.confirm('Delete this item from GitHub?');
  if (!shouldDelete) return;

  try {
    await apiFetch(`/api/admin/content/${section}/${itemId}`, { method: 'DELETE' });
    await loadSectionData();
    renderDashboardSummary();
    selectSection(section);
  } catch (error) {
    setAuthMessage(error.message || 'Could not delete content.');
  }
}

async function saveAllCurrentSectionToGitHub() {
  const section = adminState.selectedSection;
  if (!section || section === 'dashboard') {
    setAuthMessage('Please open a section before saving.');
    return;
  }

  try {
    const payload = Array.isArray(adminState.data[section]) ? adminState.data[section] : [];
    await apiFetch('/api/admin/save', {
      method: 'POST',
      body: { section, items: payload }
    });
    setAuthMessage('Saved successfully. GitHub Pages will update shortly.', false);
  } catch (error) {
    setAuthMessage(error.message || 'Failed to save to GitHub.');
  }
}

async function loadSectionData() {
  for (const section of SECTION_ORDER) {
    try {
      const result = await apiFetch(`/api/admin/content/${section}`);
      adminState.data[section] = Array.isArray(result.items) ? result.items : [];
    } catch (error) {
      adminState.data[section] = [];
    }
  }
}

function attachEvents() {
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('logout-button').addEventListener('click', handleLogout);
  document.getElementById('add-new-button').addEventListener('click', () => {
    const section = adminState.selectedSection === 'dashboard' ? 'news' : adminState.selectedSection;
    openEditor(section, null);
  });
  document.getElementById('list-add-button').addEventListener('click', () => {
    openEditor(adminState.selectedSection, null);
  });
  document.getElementById('cancel-edit').addEventListener('click', () => {
    const section = adminState.selectedSection === 'dashboard' ? 'news' : adminState.selectedSection;
    selectSection(section);
  });
  document.getElementById('save-to-github-button').addEventListener('click', saveAllCurrentSectionToGitHub);
  document.getElementById('content-form').addEventListener('submit', saveForm);

  document.querySelectorAll('.nav-tab').forEach((button) => {
    button.addEventListener('click', () => selectSection(button.dataset.section));
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  attachEvents();
  setAuthMessage('');
  await checkAuth();
});
