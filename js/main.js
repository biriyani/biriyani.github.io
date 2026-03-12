const grid = document.getElementById("grid");
const regionFilter = document.getElementById("regionFilter");
const styleFilter = document.getElementById("styleFilter");
const resultCount = document.getElementById("resultCount");

const DATA_PATH = "./data/biriyani.json";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function buildFilterOptions(select, values, label) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });

  if (!values.length) {
    const option = document.createElement("option");
    option.value = "all";
    option.textContent = `No ${label} found`;
    select.append(option);
    select.disabled = true;
  }
}

function renderCards(items) {
  if (!items.length) {
    grid.innerHTML = `<div class="empty-state">No biriyanis match this combination yet. Try another region/style pair.</div>`;
    return;
  }

  const cards = items
    .map((item) => {
      return `
        <a class="card" href="./biriyani.html?slug=${encodeURIComponent(item.slug)}">
          <figure>
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" />
          </figure>
          <div class="card-body">
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.tagline)}</p>
            <div class="tags">
              <span class="tag">${escapeHtml(item.region)}</span>
              <span class="tag">${escapeHtml(item.style)}</span>
            </div>
          </div>
        </a>
      `;
    })
    .join("");

  grid.innerHTML = cards;
}

function applyFilters(allBiriyanis) {
  const selectedRegion = regionFilter.value;
  const selectedStyle = styleFilter.value;

  const filtered = allBiriyanis.filter((item) => {
    const regionMatch = selectedRegion === "all" || item.region === selectedRegion;
    const styleMatch = selectedStyle === "all" || item.style === selectedStyle;
    return regionMatch && styleMatch;
  });

  resultCount.textContent = `${filtered.length} varieties`;
  renderCards(filtered);
}

async function init() {
  try {
    const response = await fetch(DATA_PATH);
    if (!response.ok) {
      throw new Error(`Failed to load dataset: ${response.status}`);
    }

    const biriyanis = await response.json();
    biriyanis.sort((a, b) => a.name.localeCompare(b.name));

    buildFilterOptions(regionFilter, uniqueSorted(biriyanis.map((item) => item.region)), "regions");
    buildFilterOptions(styleFilter, uniqueSorted(biriyanis.map((item) => item.style)), "styles");

    regionFilter.addEventListener("change", () => applyFilters(biriyanis));
    styleFilter.addEventListener("change", () => applyFilters(biriyanis));

    applyFilters(biriyanis);
  } catch (error) {
    console.error(error);
    grid.innerHTML = `<p class="error-text">Could not load the archive right now. Please refresh in a moment.</p>`;
  }
}

init();
