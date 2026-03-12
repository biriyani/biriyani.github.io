const root = document.getElementById("detailRoot");
const DATA_PATH = "./data/biriyani.json";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getSlugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const querySlug = params.get("slug");
  if (querySlug) {
    return querySlug;
  }

  const hashSlug = window.location.hash.replace("#", "").trim();
  return hashSlug || null;
}

function renderNotFound() {
  root.innerHTML = `
    <section class="container prose reveal">
      <p class="kicker">Not found</p>
      <h1>That biriyani is missing from this pot.</h1>
      <p>Check the URL slug or head back to the full index.</p>
      <p><a href="./index.html">Return to index</a></p>
    </section>
  `;
}

function renderDetail(item) {
  document.title = `${item.name} | Biriyani`;

  const spots = item.spots
    .map((spot) => `<li><strong>${escapeHtml(spot.name)}</strong>, ${escapeHtml(spot.city)}</li>`)
    .join("");

  const spices = item.spices.map((spice) => `<li>${escapeHtml(spice)}</li>`).join("");

  root.innerHTML = `
    <section class="detail-hero reveal">
      <figure>
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" />
      </figure>
    </section>

    <section class="detail-head reveal">
      <p class="kicker">${escapeHtml(item.region)}</p>
      <h1>${escapeHtml(item.name)}</h1>
      <p class="lead">${escapeHtml(item.tagline)}</p>
      <div class="meta-row">
        <span class="tag">${escapeHtml(item.region)}</span>
        <span class="tag">${escapeHtml(item.style)}</span>
        <span class="tag">${escapeHtml(item.rice)}</span>
      </div>
    </section>

    <section class="content-grid reveal">
      <article class="panel panel-wide">
        <h2>Origin Story</h2>
        <p>${escapeHtml(item.origin)}</p>
      </article>

      <article class="panel panel-wide">
        <h2>What Makes It Distinct</h2>
        <p>${escapeHtml(item.distinct)}</p>
      </article>

      <article class="panel">
        <h2>Rice Type</h2>
        <p>${escapeHtml(item.rice)}</p>
      </article>

      <article class="panel">
        <h2>Protein</h2>
        <p>${escapeHtml(item.protein)}</p>
      </article>

      <article class="panel">
        <h2>Key Spices</h2>
        <ul>${spices}</ul>
      </article>

      <article class="panel">
        <h2>Legendary Spots</h2>
        <ul>${spots}</ul>
      </article>
    </section>

    <p class="credit">
      ${escapeHtml(item.image_credit)}.
      <a href="${escapeHtml(item.image_credit_url)}" target="_blank" rel="noreferrer">Image source</a>
    </p>
  `;
}

async function init() {
  const slug = getSlugFromUrl();
  if (!slug) {
    renderNotFound();
    return;
  }

  try {
    const response = await fetch(DATA_PATH);
    if (!response.ok) {
      throw new Error(`Failed to load dataset: ${response.status}`);
    }

    const biriyanis = await response.json();
    const match = biriyanis.find((item) => item.slug === slug);

    if (!match) {
      renderNotFound();
      return;
    }

    renderDetail(match);
  } catch (error) {
    console.error(error);
    root.innerHTML = `<p class="error-text">Could not load this biriyani right now. Please refresh in a moment.</p>`;
  }
}

init();
