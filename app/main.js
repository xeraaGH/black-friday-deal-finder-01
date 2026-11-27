// Bargain Lantern — wiring: toolbar state, hash routing, counts.
// List view is #/ (default). Detail view is #/deal/<id>.
import { CATEGORIES, CHECKED_AT, CHECKED_NOTE, DEALS, STORES } from './deals.js';
import { applyFilters, discountPct, sortDeals } from './filters.js';
import { renderDetail, renderList } from './render.js';

const grid = document.getElementById('grid');
const detail = document.getElementById('detail');
const listView = document.getElementById('list-view');
const countLine = document.getElementById('count-line');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const storeSelect = document.getElementById('store');
const discountSelect = document.getElementById('min-discount');
const verdictSelect = document.getElementById('verdict');
const sortSelect = document.getElementById('sort');

function fillSelect(select, items) {
  for (const item of items) {
    const opt = document.createElement('option');
    opt.value = item;
    opt.textContent = item;
    select.append(opt);
  }
}
fillSelect(categorySelect, CATEGORIES);
fillSelect(storeSelect, STORES);

document.getElementById('checked-line').textContent = CHECKED_NOTE;
document.getElementById('stat-deals').textContent = String(DEALS.length);
document.getElementById('stat-stores').textContent = String(STORES.length);
document.getElementById('stat-cats').textContent = String(CATEGORIES.length);
document.getElementById('stat-best').textContent =
  '-' + Math.max(...DEALS.map(discountPct)) + '%';
document.getElementById('stat-true-lows').textContent = String(
  DEALS.filter((d) => d.verdict === 'true-low').length,
);

function currentFilters() {
  return {
    q: searchInput.value,
    category: categorySelect.value,
    store: storeSelect.value,
    minDiscount: discountSelect.value,
    verdict: verdictSelect.value,
  };
}

function refreshList() {
  const filtered = sortDeals(applyFilters(DEALS, currentFilters()), sortSelect.value);
  renderList(grid, filtered);
  countLine.textContent =
    filtered.length + ' of ' + DEALS.length + ' deals · checked ' + CHECKED_AT;
}

function route() {
  const hash = location.hash || '#/';
  if (hash.startsWith('#/deal/')) {
    const deal = DEALS.find((d) => d.id === hash.slice(7));
    if (deal) {
      listView.hidden = true;
      detail.hidden = false;
      renderDetail(detail, deal);
      window.scrollTo(0, 0);
      return;
    }
  }
  detail.hidden = true;
  listView.hidden = false;
  refreshList();
}

for (const control of [searchInput, categorySelect, storeSelect, discountSelect, verdictSelect, sortSelect]) {
  control.addEventListener('input', refreshList);
  control.addEventListener('change', refreshList);
}
document.getElementById('clear-filters').addEventListener('click', () => {
  searchInput.value = '';
  categorySelect.value = 'All';
  storeSelect.value = 'All';
  discountSelect.value = '';
  verdictSelect.value = 'All';
  sortSelect.value = 'discount';
  refreshList();
});

window.addEventListener('hashchange', route);
route();
