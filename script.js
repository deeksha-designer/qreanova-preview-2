const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const megaButton = document.querySelector('.mega-trigger');
const megaMenu = document.querySelector('.mega-menu');
const desktopNav = document.querySelector('.desktop-nav');
let openTimer;
let closeTimer;

function setMega(open) {
  clearTimeout(openTimer);
  clearTimeout(closeTimer);
  megaMenu.hidden = !open;
  megaButton.setAttribute('aria-expanded', String(open));
}
function closeMegaSoon() {
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => setMega(false), 250);
}
megaButton.addEventListener('click', () => setMega(megaMenu.hidden));
megaButton.addEventListener('mouseenter', () => {
  clearTimeout(closeTimer);
  openTimer = setTimeout(() => setMega(true), 180);
});
desktopNav.addEventListener('mouseleave', closeMegaSoon);
megaMenu.addEventListener('mouseenter', () => clearTimeout(closeTimer));
megaMenu.addEventListener('mouseleave', closeMegaSoon);
megaMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMega(false)));
document.addEventListener('click', event => {
  if (!megaMenu.contains(event.target) && !megaButton.contains(event.target)) setMega(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !megaMenu.hidden) { setMega(false); megaButton.focus(); }
});

// Keep the navigation discoverable on hover while retaining keyboard/click access.
megaButton.addEventListener('focus', () => setMega(true));

menuButton.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}));

const heroVideo = document.querySelector('.hero video');
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) heroVideo.pause();

const previews = {
  chimney: { title: 'Chimneys', description: 'A defining detail for a considered kitchen.', price: '₹42,990', image: 'assets/product-chimney.png', alt: 'Concept image of a matte black chimney', target: '#chimneys' },
  hob: { title: 'Hobs & cooktops', description: 'The centre of every creation.', price: '₹28,490', image: 'assets/product-hob.png', alt: 'Concept image of a black glass hob', target: '#hobs' },
  microwave: { title: 'Built-in microwaves', description: 'Designed to sit beautifully within the kitchen.', price: '₹36,990', image: 'assets/built-in-ovens.png', alt: 'Concept image of a built-in microwave', target: '#ovens' },
  oven: { title: 'Built-in ovens', description: 'A refined approach to an everyday essential.', price: '₹54,990', image: 'assets/product-oven.png', alt: 'Concept image of a built-in oven', target: '#ovens' },
  induction: { title: 'Infrared induction', description: 'Flexible cooking for the way you live.', price: '₹12,990', image: 'assets/product-induction.png', alt: 'Concept image of an infrared induction cooktop', target: '#collection' }
};
const previewImage = document.querySelector('#preview-image');
const previewTitle = document.querySelector('#preview-title');
const previewDescription = document.querySelector('#preview-description');
const previewPrice = document.querySelector('#preview-price');
const previewLink = document.querySelector('#preview-link');
const hotspots = [...document.querySelectorAll('.hotspot')];
function showPreview(button) {
  const item = previews[button.dataset.product];
  if (!item) return;
  previewImage.src = item.image;
  previewImage.alt = item.alt;
  previewTitle.textContent = item.title;
  previewDescription.textContent = item.description;
  if (previewPrice) previewPrice.textContent = item.price;
  previewLink.href = item.target;
  hotspots.forEach(hotspot => {
    const active = hotspot === button;
    hotspot.classList.toggle('active', active);
    hotspot.setAttribute('aria-pressed', String(active));
  });
}
hotspots.forEach(button => {
  button.addEventListener('mouseenter', () => showPreview(button));
  button.addEventListener('focus', () => showPreview(button));
  button.addEventListener('click', () => showPreview(button));
});

const editorialTrack = document.querySelector('.editorial-track');
const editorialPrev = document.querySelector('.slider-prev');
const editorialNext = document.querySelector('.slider-next');
function moveEditorial(direction) {
  if (!editorialTrack) return;
  const slide = editorialTrack.querySelector('article');
  editorialTrack.scrollBy({ left: direction * (slide?.getBoundingClientRect().width + 18 || 420), behavior: 'smooth' });
}
editorialPrev?.addEventListener('click', () => moveEditorial(-1));
editorialNext?.addEventListener('click', () => moveEditorial(1));

const experienceTrack = document.querySelector('.experience-track');
const experienceSlides = [...document.querySelectorAll('.experience-track article')];
const experienceCounter = document.querySelector('.experience-controls b');
function moveExperience(direction) {
  if (!experienceTrack || !experienceSlides.length) return;
  const current = experienceSlides.reduce((closest, slide, index) => {
    const distance = Math.abs(slide.offsetLeft - experienceTrack.scrollLeft);
    return distance < closest.distance ? { index, distance } : closest;
  }, { index: 0, distance: Infinity }).index;
  const next = (current + direction + experienceSlides.length) % experienceSlides.length;
  experienceTrack.scrollTo({ left: experienceSlides[next].offsetLeft, behavior: 'smooth' });
  if (experienceCounter) experienceCounter.textContent = String(next + 1).padStart(2, '0');
}
document.querySelector('.experience-prev')?.addEventListener('click', () => moveExperience(-1));
document.querySelector('.experience-next')?.addEventListener('click', () => moveExperience(1));
experienceTrack?.addEventListener('scroll', () => {
  const current = experienceSlides.reduce((closest, slide, index) => {
    const distance = Math.abs(slide.offsetLeft - experienceTrack.scrollLeft);
    return distance < closest.distance ? { index, distance } : closest;
  }, { index: 0, distance: Infinity }).index;
  if (experienceCounter) experienceCounter.textContent = String(current + 1).padStart(2, '0');
}, { passive: true });

const journalTrack = document.querySelector('.journal-grid');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let journalTimer;
let journalVisible = true;
function advanceJournal() {
  if (!journalTrack || !journalVisible || reduceMotion) return;
  const card = journalTrack.querySelector('.journal-card:not([hidden])');
  const step = (card?.getBoundingClientRect().width || 420) + 18;
  const atEnd = journalTrack.scrollLeft + journalTrack.clientWidth >= journalTrack.scrollWidth - 12;
  journalTrack.scrollTo({ left: atEnd ? 0 : journalTrack.scrollLeft + step, behavior: 'smooth' });
}
function startJournal() {
  if (!journalTrack || reduceMotion) return;
  clearInterval(journalTimer);
  journalTimer = setInterval(advanceJournal, 4200);
}
function stopJournal() { clearInterval(journalTimer); }
if (journalTrack) {
  journalTrack.addEventListener('mouseenter', stopJournal);
  journalTrack.addEventListener('mouseleave', startJournal);
  journalTrack.addEventListener('focusin', stopJournal);
  journalTrack.addEventListener('focusout', startJournal);
  new IntersectionObserver(entries => {
    journalVisible = entries[0]?.isIntersecting ?? false;
    if (journalVisible) startJournal(); else stopJournal();
  }, { threshold: 0.15 }).observe(journalTrack);
}

const collectionImage = document.querySelector('#collection-image');
document.querySelectorAll('.collection-tabs button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.collection-tabs button').forEach(tab => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    if (!collectionImage) return;
    collectionImage.classList.add('changing');
    window.setTimeout(() => {
      collectionImage.src = button.dataset.image;
      collectionImage.alt = button.dataset.alt;
      collectionImage.classList.remove('changing');
    }, reduceMotion ? 0 : 140);
  });
});

function moveJournal(direction) {
  if (!journalTrack) return;
  const card = journalTrack.querySelector('.journal-card:not([hidden])');
  const step = (card?.getBoundingClientRect().width || 420) + 24;
  journalTrack.scrollBy({ left: direction * step, behavior: reduceMotion ? 'auto' : 'smooth' });
}
document.querySelector('.journal-prev')?.addEventListener('click', () => moveJournal(-1));
document.querySelector('.journal-next')?.addEventListener('click', () => moveJournal(1));
document.querySelectorAll('.journal-tabs button').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('.journal-tabs button').forEach(tab => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    journalTrack?.querySelectorAll('.journal-card').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
    journalTrack?.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    startJournal();
  });
});

const searchButton = document.querySelector('.search-toggle');
const searchPanel = document.querySelector('.search-panel');
const searchInput = document.querySelector('#site-search-input');
const searchResults = document.querySelector('.search-results');
const searchEntries = [
  { label: 'Chimneys', terms: 'chimney hood ventilation', href: '#chimneys' },
  { label: 'Hobs & cooktops', terms: 'hob gas cooktop burner', href: '#hobs' },
  { label: 'Built-in ovens', terms: 'oven cooking built in', href: '#ovens' },
  { label: 'Built-in microwaves', terms: 'microwave built in', href: '#ovens' },
  { label: 'Infrared induction', terms: 'induction infrared cooktop', href: '#visualizer' },
  { label: 'Kitchen visualizer', terms: 'visualizer kitchen image', href: '#visualizer' },
  { label: 'Manuals & downloads', terms: 'manual guide download', href: '#manuals' },
  { label: 'Warranty information', terms: 'warranty registration', href: '#warranty' },
  { label: 'Service & care', terms: 'service support care', href: '#service' }
];
function renderSearch(query = '') {
  const q = query.toLowerCase().trim();
  const matches = searchEntries.filter(item => !q || `${item.label} ${item.terms}`.toLowerCase().includes(q)).slice(0, 6);
  searchResults.replaceChildren();
  if (!matches.length) {
    const message = document.createElement('p');
    message.textContent = 'No matching section found.';
    searchResults.append(message);
    return;
  }
  matches.forEach(item => {
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = `${item.label} →`;
    link.addEventListener('click', closeSearch);
    searchResults.append(link);
  });
}
function closeSearch() {
  searchPanel.hidden = true;
  searchButton.setAttribute('aria-expanded', 'false');
}
searchButton.addEventListener('click', () => {
  const open = searchPanel.hidden;
  searchPanel.hidden = !open;
  searchButton.setAttribute('aria-expanded', String(open));
  if (open) { setMega(false); renderSearch(searchInput.value); searchInput.focus(); }
});
searchInput.addEventListener('input', () => renderSearch(searchInput.value));
searchInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') searchResults.querySelector('a')?.click();
});
document.addEventListener('click', event => {
  if (!searchPanel.contains(event.target) && !searchButton.contains(event.target)) closeSearch();
});

const catalog = {
  chimney: { name: 'Chimneys', image: 'assets/product-chimney.png' },
  hob: { name: 'Hobs & cooktops', image: 'assets/product-hob.png' },
  oven: { name: 'Built-in ovens', image: 'assets/product-oven.png' }
};
const cartButton = document.querySelector('.cart-toggle');
const cartDrawer = document.querySelector('.cart-drawer');
const cartBackdrop = document.querySelector('.cart-backdrop');
const cartItems = document.querySelector('.cart-items');
let cart = [];
try { cart = JSON.parse(localStorage.getItem('qreanova-concept-cart') || '[]').filter(id => catalog[id]); } catch { cart = []; }
function renderCart() {
  document.querySelector('.cart-count').textContent = String(cart.length);
  cartItems.replaceChildren();
  if (!cart.length) {
    const empty = document.createElement('p'); empty.className = 'cart-empty';
    empty.textContent = 'Your bag is empty. Explore the collection to select an appliance.';
    cartItems.append(empty); return;
  }
  cart.forEach((id, index) => {
    const item = document.createElement('article'); item.className = 'cart-item';
    const image = document.createElement('img'); image.src = catalog[id].image; image.alt = '';
    const details = document.createElement('div');
    const title = document.createElement('h3'); title.textContent = catalog[id].name;
    const note = document.createElement('p'); note.textContent = 'Product details available on request';
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove';
    remove.addEventListener('click', () => { cart.splice(index, 1); saveCart(); });
    details.append(title, note, remove); item.append(image, details); cartItems.append(item);
  });
}
function saveCart() {
  localStorage.setItem('qreanova-concept-cart', JSON.stringify(cart));
  renderCart();
}
function openCart() {
  cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden', 'false');
  cartBackdrop.hidden = false; document.body.style.overflow = 'hidden';
  document.querySelector('.cart-close').focus();
}
function closeCart() {
  cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden', 'true');
  cartBackdrop.hidden = true; document.body.style.overflow = '';
}
cartButton.addEventListener('click', openCart);
document.querySelector('.cart-close').addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);
document.querySelectorAll('.add-cart, .buy-now').forEach(button => button.addEventListener('click', () => {
  cart.push(button.dataset.product); saveCart(); openCart();
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeCart(); closeSearch(); }
});
renderCart();

const revealSections = [...document.querySelectorAll('main section')];
if (!reduceMotion && 'IntersectionObserver' in window) {
  revealSections.forEach(section => section.classList.add('reveal-ready'));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
  revealSections.forEach(section => revealObserver.observe(section));
}
