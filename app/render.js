// Rendering: deal cards and the deal detail view. Builds DOM with
// createElement/textContent only — no innerHTML with deal data.
import { CHECKED_AT, DEALS, VERDICTS } from './deals.js';
import { discountPct, money, sameProductElsewhere } from './filters.js';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

export function verdictChip(verdict) {
  const chip = el('span', 'verdict verdict-' + verdict, VERDICTS[verdict].label);
  chip.title = VERDICTS[verdict].blurb;
  return chip;
}

export function dealCard(deal) {
  const card = el('article', 'card');
  const top = el('div', 'card-top');
  top.append(el('span', 'cat', deal.category), el('span', 'pct', '-' + discountPct(deal) + '%'));
  card.append(top);

  const title = el('h3', 'card-name');
  const link = document.createElement('a');
  link.href = '#/deal/' + deal.id;
  link.textContent = deal.name;
  title.append(link);
  card.append(title);

  const store = el('p', 'card-store', deal.store);
  card.append(store);

  const prices = el('div', 'prices');
  prices.append(el('span', 'sale', money(deal.sale)));
  const was = el('span', 'was', 'was ' + money(deal.list));
  prices.append(was);
  const save = el('span', 'save', 'save ' + money(deal.list - deal.sale));
  prices.append(save);
  card.append(prices);

  const verdictRow = el('div', 'verdict-row');
  verdictRow.append(verdictChip(deal.verdict));
  verdictRow.append(el('span', 'evidence', deal.evidence));
  card.append(verdictRow);

  const meta = el('p', 'checked', 'Checked ' + CHECKED_AT + ' · ' + deal.source);
  card.append(meta);

  const shop = document.createElement('a');
  shop.className = 'shop-btn';
  shop.href = deal.url;
  shop.target = '_blank';
  shop.rel = 'noopener';
  shop.textContent = 'View at ' + deal.store + ' →';
  card.append(shop);
  return card;
}

export function renderList(container, deals) {
  container.replaceChildren();
  if (deals.length === 0) {
    const empty = el('p', 'empty', 'No deals match those filters. Try clearing the search or lowering the minimum discount.');
    container.append(empty);
    return;
  }
  for (const d of deals) container.append(dealCard(d));
}

export function renderDetail(container, deal) {
  container.replaceChildren();
  const back = document.createElement('a');
  back.className = 'back';
  back.href = '#/';
  back.textContent = '← All deals';
  container.append(back);

  const wrap = el('div', 'detail');
  wrap.append(el('p', 'cat', deal.category));
  wrap.append(el('h2', 'detail-name', deal.name));
  wrap.append(el('p', 'card-store', deal.store));

  const prices = el('div', 'prices detail-prices');
  prices.append(el('span', 'sale', money(deal.sale)));
  prices.append(el('span', 'was', 'was ' + money(deal.list)));
  prices.append(el('span', 'pct', '-' + discountPct(deal) + '%'));
  prices.append(el('span', 'save', 'you save ' + money(deal.list - deal.sale)));
  wrap.append(prices);

  const vrow = el('div', 'verdict-row');
  vrow.append(verdictChip(deal.verdict));
  const vtext = el('div');
  vtext.append(el('strong', null, VERDICTS[deal.verdict].label + ': '));
  vtext.append(document.createTextNode(deal.evidence));
  vrow.append(vtext);
  wrap.append(vrow);

  wrap.append(el('p', 'checked', 'Price checked ' + CHECKED_AT + '. Source: ' + deal.source + '.'));
  wrap.append(el('p', 'note', deal.note));

  const shop = document.createElement('a');
  shop.className = 'shop-btn big';
  shop.href = deal.url;
  shop.target = '_blank';
  shop.rel = 'noopener';
  shop.textContent = 'View at ' + deal.store + ' →';
  wrap.append(shop);

  const others = sameProductElsewhere(DEALS, deal);
  if (others.length) {
    wrap.append(el('h3', 'compare-title', 'Same product at other stores'));
    const tableWrap = el('div', 'compare-wrap');
    const table = el('table', 'compare');
    const head = document.createElement('tr');
    for (const h of ['Store', 'Price', 'Discount', 'Verdict', 'Link']) head.append(el('th', null, h));
    table.append(head);
    const rows = [deal, ...others].sort((a, b) => a.sale - b.sale);
    for (const o of rows) {
      const tr = document.createElement('tr');
      if (o.id === deal.id) tr.className = 'current';
      tr.append(el('td', null, o.store));
      tr.append(el('td', null, money(o.sale)));
      tr.append(el('td', null, '-' + discountPct(o) + '%'));
      tr.append(el('td', null, VERDICTS[o.verdict].label));
      const linkCell = el('td');
      const storeLink = document.createElement('a');
      storeLink.href = o.url;
      storeLink.target = '_blank';
      storeLink.rel = 'noopener';
      storeLink.textContent = 'View at ' + o.store + ' →';
      linkCell.append(storeLink);
      tr.append(linkCell);
      table.append(tr);
    }
    tableWrap.append(table);
    wrap.append(tableWrap);
    wrap.append(el('p', 'checked', 'Cheapest first. Prices checked ' + CHECKED_AT + '.'));
  }
  container.append(wrap);
}
