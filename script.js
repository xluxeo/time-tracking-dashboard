let dashboardData = [];

async function loadData() {
  const grid = document.getElementById("dashboard-grid");
  try {
    const response = await fetch("./data.json");
    if (!response.ok) throw new Error("Netzwerk-Antwort war nicht ok");
    dashboardData = await response.json();

    renderCards("weekly");
    setupNavigation();
  } catch (error) {
    console.error("Fehler beim Laden der JSON-Daten:", error);
    grid.innerHTML = `<div class="c-alert">Die Daten konnten leider nicht geladen werden.</div>`;
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function renderCards(timeframe) {
  const grid = document.getElementById("dashboard-grid");

  let htmlContent = "";
  const previousLabels = { daily: "Yesterday", weekly: "Last Week", monthly: "Last Month" };

  dashboardData.forEach((card) => {
    const cardVariant = escapeHTML(card.title.toLowerCase().replace(" ", "-"));
    const currentHours = escapeHTML(String(card.timeframes[timeframe].current));
    const previousHours = escapeHTML(String(card.timeframes[timeframe].previous));
    const label = previousLabels[timeframe];

    htmlContent += `
      <article class="c-card" data-card-variant="${cardVariant}">
        <div class="c-card__content">
          <div class="c-card__header">
            <h2 class="c-card__title">${escapeHTML(card.title)}</h2>
            <button class="c-card__menu-btn" aria-label="Options">...</button>
          </div>
          <div class="c-card__body">
            <span class="c-card__hours">${currentHours}hrs</span>
            <p class="c-card__subtitle">${label} - ${previousHours}hrs</p>
          </div>
        </div>
      </article>
    `;
  });

  grid.innerHTML = htmlContent;
}

function setupNavigation() {
  const navButtons = document.querySelectorAll(".c-navigation__button");

  navButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      navButtons.forEach((btn) => btn.classList.remove("active"));
      event.target.classList.add("active");
      renderCards(event.target.getAttribute("data-timeframe"));
    });
  });
}

loadData();