// Mock theater data
const theaterData = [
  {id: 1, name: "PVR Phoenix", chain: "pvr", distance: 1.2, price: 350, availability: 85, wheelchair: true, parking: true, showtimes: ["10:30 AM", "1:45 PM", "5:00 PM", "8:15 PM"]},
  {id: 2, name: "INOX R City", chain: "inox", distance: 2.8, price: 280, availability: 45, wheelchair: true, parking: false, showtimes: ["11:00 AM", "2:15 PM", "6:30 PM"]},
  {id: 3, name: "PVR Icon", chain: "pvr", distance: 3.5, price: 420, availability: 92, wheelchair: false, parking: true, showtimes: ["12:00 PM", "3:30 PM", "7:00 PM", "10:15 PM"]},
  {id: 4, name: "Cinepolis Andheri", chain: "other", distance: 1.8, price: 300, availability: 12, wheelchair: true, parking: true, showtimes: ["10:00 AM", "1:30 PM", "5:15 PM"]},
  {id: 5, name: "Carnival Cinema", chain: "other", distance: 4.2, price: 220, availability: 68, wheelchair: false, parking: false, showtimes: ["11:30 AM", "3:00 PM", "6:45 PM", "9:30 PM"]},
  {id: 6, name: "INOX Megaplex", chain: "inox", distance: 5.1, price: 260, availability: 55, wheelchair: true, parking: true, showtimes: ["10:15 AM", "1:00 PM", "4:30 PM", "8:00 PM"]},
  {id: 7, name: "PVR Juhu", chain: "pvr", distance: 6.5, price: 380, availability: 75, wheelchair: true, parking: false, showtimes: ["11:45 AM", "3:15 PM", "7:30 PM"]},
  {id: 8, name: "Fun Cinemas", chain: "other", distance: 2.1, price: 180, availability: 30, wheelchair: false, parking: true, showtimes: ["10:45 AM", "2:00 PM", "5:45 PM", "9:15 PM"]}
];

let currentSort = 'distance';
let activeFilters = {chain: [], radius: 5, amenities: []};

// DOM elements
const theaterList = document.getElementById('theaterList');
const sortBtn = document.getElementById('sortBtn');
const filterBtn = document.getElementById('filterBtn');
const sortSheet = document.getElementById('sortSheet');
const filterSheet = document.getElementById('filterSheet');
const overlay = document.getElementById('overlay');
const applyFilters = document.getElementById('applyFilters');
const activeFiltersEl = document.getElementById('activeFilters');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderTheaters();
  setupEventListeners();
});

function setupEventListeners() {
  sortBtn.addEventListener('click', () => openSheet(sortSheet));
  filterBtn.addEventListener('click', () => openSheet(filterSheet));
  overlay.addEventListener('click', closeAllSheets);
  
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => closeSheet(btn.dataset.sheet));
  });

  document.querySelectorAll('input[name="sort"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderTheaters();
      closeAllSheets();
    });
  });

  applyFilters.addEventListener('click', () => {
    activeFilters.chain = Array.from(document.querySelectorAll('input[name="chain"]:checked')).map(el => el.value);
    activeFilters.radius = parseInt(document.querySelector('input[name="radius"]:checked').value);
    activeFilters.amenities = Array.from(document.querySelectorAll('input[name="amenity"]:checked')).map(el => el.value);
    updateActiveFilterChips();
    renderTheaters();
    closeAllSheets();
  });
}

function openSheet(sheet) {
  sheet.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSheet(sheetId) {
  document.getElementById(sheetId).classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function closeAllSheets() {
  document.querySelectorAll('.bottom-sheet').forEach(sheet => sheet.classList.remove('active'));
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function filterTheaters(theaters) {
  return theaters.filter(t => {
    if (t.distance > activeFilters.radius) return false;
    if (activeFilters.chain.length && !activeFilters.chain.includes(t.chain)) return false;
    if (activeFilters.amenities.includes('wheelchair') && !t.wheelchair) return false;
    if (activeFilters.amenities.includes('parking') && !t.parking) return false;
    return true;
  });
}

function sortTheaters(theaters) {
  const sorted = [...theaters];
  if (currentSort === 'distance') sorted.sort((a, b) => a.distance - b.distance);
  else if (currentSort === 'price-low') sorted.sort((a, b) => a.price - b.price);
  else if (currentSort === 'price-high') sorted.sort((a, b) => b.price - a.price);
  else if (currentSort === 'availability') sorted.sort((a, b) => b.availability - a.availability);
  return sorted;
}

function renderTheaters() {
  let theaters = filterTheaters(theaterData);
  theaters = sortTheaters(theaters);

  if (theaters.length === 0) {
    theaterList.innerHTML = `<div class="empty-state container"><h3>No theaters found</h3><p>Try adjusting your filters or expanding the search radius</p><button class="empty-state-btn" onclick="resetFilters()">Reset Filters</button></div>`;
    return;
  }

  theaterList.innerHTML = '<div class="container">' + theaters.map(t => `
    <div class="theater-card">
      <div class="theater-header">
        <div class="theater-info">
          <h3>${t.name}</h3>
          <div class="theater-meta">
            <span class="distance">📍 ${t.distance} km away</span>
            <span class="price-badge">₹${t.price}</span>
          </div>
        </div>
      </div>
      ${(t.wheelchair || t.parking) ? `<div class="amenities">
        ${t.wheelchair ? '<span class="amenity-badge">♿ Wheelchair</span>' : ''}
        ${t.parking ? '<span class="amenity-badge">🅿️ Parking</span>' : ''}
      </div>` : ''}
      <div class="showtimes">
        ${t.showtimes.map((time, i) => `
          <button class="showtime-btn ${t.availability < 20 && i === 0 ? 'sold-out' : ''}">
            ${time}${t.availability < 40 ? '<span class="availability-badge">Fast filling</span>' : ''}
          </button>
        `).join('')}
      </div>
    </div>
  `).join('') + '</div>';
}

function updateActiveFilterChips() {
  const chips = [];
  if (activeFilters.chain.length) chips.push(...activeFilters.chain.map(c => ({label: c.toUpperCase(), type: 'chain', value: c})));
  if (activeFilters.amenities.length) chips.push(...activeFilters.amenities.map(a => ({label: a === 'wheelchair' ? '♿ Accessible' : '🅿️ Parking', type: 'amenity', value: a})));
  
  activeFiltersEl.innerHTML = chips.map(chip => `
    <div class="filter-chip">
      ${chip.label}
      <span class="remove" onclick="removeFilter('${chip.type}', '${chip.value}')">✕</span>
    </div>
  `).join('');
}

function removeFilter(type, value) {
  if (type === 'chain') activeFilters.chain = activeFilters.chain.filter(c => c !== value);
  if (type === 'amenity') activeFilters.amenities = activeFilters.amenities.filter(a => a !== value);
  updateActiveFilterChips();
  renderTheaters();
  document.querySelectorAll(`input[name="${type}"][value="${value}"]`).forEach(el => el.checked = false);
}

function resetFilters() {
  activeFilters = {chain: [], radius: 5, amenities: []};
  document.querySelectorAll('input[name="chain"]').forEach(el => el.checked = false);
  document.querySelectorAll('input[name="amenity"]').forEach(el => el.checked = false);
  document.querySelector('input[name="radius"][value="5"]').checked = true;
  updateActiveFilterChips();
  renderTheaters();
}
