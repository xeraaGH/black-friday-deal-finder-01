// Filtering and sorting for the deal list. Pure functions, no DOM here,
// so the same rules drive the list, the counts and the detail page.

// Discount percent, computed from the two prices so it always adds up.
export function discountPct(deal) {
  return Math.round((1 - deal.sale / deal.list) * 100);
}

export function money(n) {
  return '$' + n.toFixed(2).replace(/\.00$/, '');
}

export function applyFilters(deals, f) {
  const q = (f.q || '').trim().toLowerCase();
  return deals.filter((d) => {
    if (f.category && f.category !== 'All' && d.category !== f.category) return false;
    if (f.store && f.store !== 'All' && d.store !== f.store) return false;
    if (f.verdict && f.verdict !== 'All' && d.verdict !== f.verdict) return false;
    if (f.minDiscount && discountPct(d) < Number(f.minDiscount)) return false;
    if (q) {
      const hay = (d.name + ' ' + d.store + ' ' + d.category).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sortDeals(deals, sort) {
  const list = [...deals];
  if (sort === 'discount') list.sort((a, b) => discountPct(b) - discountPct(a) || b.list - b.sale - (a.list - a.sale));
  else if (sort === 'verdict') {
    const rank = { 'true-low': 0, strong: 1, routine: 2 };
    list.sort((a, b) => rank[a.verdict] - rank[b.verdict] || discountPct(b) - discountPct(a));
  } else if (sort === 'price-low') list.sort((a, b) => a.sale - b.sale);
  else if (sort === 'price-high') list.sort((a, b) => b.sale - a.sale);
  else if (sort === 'saving') list.sort((a, b) => b.list - b.sale - (a.list - a.sale));
  return list;
}

// Other stores carrying the same product (matched on identical name).
export function sameProductElsewhere(deals, deal) {
  return deals.filter((d) => d.id !== deal.id && d.name === deal.name);
}
