// ui.js - UI helper methods and renderers
// Global UI object provides formatting utilities, DOM helpers,
// and rendering functions that return HTML strings for insertion.

const UI = {
  /*
   * formatNumber(number, decimals)
   * - Returns a localized number string with thousand separators.
   * - Uses en-US locale formatting and fixed decimal places.
   */
  formatNumber: function(number, decimals = 2) {
    const n = Number(number) || 0;
    return n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  },

  /*
   * formatCurrency(value)
   * - Formats a numeric value as R$ with pt-BR locale.
   * - Returns a string like: "R$ 1.234,56"
   */
  formatCurrency: function(value) {
    const v = Number(value) || 0;
    return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  /*
   * showElement / hideElement
   * - Utility to toggle the `hidden` utility class on elements by id.
   */
  showElement: function(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.classList.remove('hidden');
  },

  hideElement: function(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.classList.add('hidden');
  },

  /*
   * scrollToElement
   * - Smoothly scrolls the page to the element with given id.
   */
  scrollToElement: function(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  /*
   * renderResults(data)
   * - Builds HTML for a compact results card set.
   * - `data` object: { origin, destination, distance, emission, mode, savings }
   *
   * Structure returned (example):
   * <div class="results_card results_card--route"> ... origin → destination ...</div>
   * <div class="results_card results_card--distance"> ... distance ...</div>
   * <div class="results_card results_card--emission"> ... emission ...</div>
   * <div class="results_card results_card--transport"> ... transport ...</div>
   */
  renderResults: function(data) {
    const modeMeta = (CONFIG && CONFIG.TRANSPORT_MODES && CONFIG.TRANSPORT_MODES[data.mode]) || {};
    const modeIcon = modeMeta.icon || '';
    const modeLabel = modeMeta.label || data.mode || '';

    const emissionFormatted = this.formatNumber(data.emission, 2);
    const distanceFormatted = this.formatNumber(data.distance, 2);

    const html = `
      <div class="results_card">
        <span class="results_icon">📍</span>
        <div class="results_data">
          <p class="results_label">Rota</p>
          <p class="results_value">${data.origin} → ${data.destination}</p>
        </div>
      </div>

      <div class="results_card">
        <span class="results_icon">📏</span>
        <div class="results_data">
          <p class="results_label">Distância</p>
          <p class="results_value">${distanceFormatted} km</p>
        </div>
      </div>

      <div class="results_card">
        <span class="results_icon">🌿</span>
        <div class="results_data">
          <p class="results_label">Emissão</p>
          <p class="results_value">${emissionFormatted} kg CO₂</p>
        </div>
      </div>

      <div class="results_card">
        <span class="results_icon">${modeIcon}</span>
        <div class="results_data">
          <p class="results_label">Modo de Transporte</p>
          <p class="results_value">${modeLabel}</p>
        </div>
      </div>
    `;

    return html;
  },

  /*
   * renderComparison(modesArray, selectedMode)
   * - modesArray: output from Calculator.calculateAllModes(distance)
   * - selectedMode: string key of currently selected mode
   *
   * Returns HTML string containing a list of comparison items and a tip box.
   * Each comparison item structure:
   * <div class="comparison_item [--selected]">
   *   <header> icon label [badge] </header>
   *   <div class="comparison_item__stats"> emission / percentage vs car </div>
   *   <div class="comparison_item__bar"><div class="comparison_item__bar-fill" style="width: XX%"></div></div>
   * </div>
   */
  renderComparison: function(modesArray, selectedMode) {
    if (!Array.isArray(modesArray) || modesArray.length === 0) return '';

    // Determine maximum emission to normalize progress bars
    const maxEmission = Math.max(...modesArray.map(m => m.emission || 0, 0));

    const itemsHtml = modesArray.map((m) => {
      const meta = (CONFIG && CONFIG.TRANSPORT_MODES && CONFIG.TRANSPORT_MODES[m.mode]) || {};
      const icon = meta.icon || '';
      const label = meta.label || m.mode;

      const emissionStr = this.formatNumber(m.emission, 2) + ' kg';
      const percentStr = m.percentageVsCar !== null ? (m.percentageVsCar + '% vs carro') : '—';

      // Progress width based on emission relative to maxEmission
      const widthPct = maxEmission > 0 ? Math.round((m.emission / maxEmission) * 100) : 0;

      // Determine color based on widthPct
      let barColor = 'green';
      if (widthPct <= 25) barColor = 'green';
      else if (widthPct <= 75) barColor = 'yellow';
      else if (widthPct <= 100) barColor = 'orange';
      else barColor = 'red';

      const selectedClass = (m.mode === selectedMode) ? 'comparison_item--selected' : '';
      const badge = (m.mode === selectedMode) ? '<span class="comparison_badge">Selecionado</span>' : '';

      return `
        <div class="comparison_item ${selectedClass}">
          <div class="comparison_header">
            <div class="comparison_mode">
              <span class="comparison_icon">${icon}</span>
              <strong class="comparison_label">${label}</strong>
            </div>
            ${badge}
          </div>
          <div class="comparison_stats">${emissionStr} • ${percentStr}</div>
          <div class="comparison_bar-container" aria-hidden="true">
            <div class="comparison_bar" style="width:${widthPct}%; background:${barColor};"></div>
          </div>
        </div>
      `;
    }).join('');

    const tipBox = `
      <div class="comparison_tip">
        <span class="comparison_tip_icon">💡</span>
        <p class="comparison_tip_text"><strong>Dica:</strong> Compare as emissões por modo de transporte para escolher a opção mais sustentável.</p>
      </div>
    `;

    return `<div>${itemsHtml}</div>${tipBox}`;
  },

  /*
   * renderCarbonCredits(creditsData)
   * - creditsData: { credits, price: { min, max, average } }
   *
   * Returns HTML string with two cards: credits needed and estimated price.
   */
  renderCarbonCredits: function(creditsData) {
    const credits = creditsData.credits || 0;
    const price = creditsData.price || { min: 0, max: 0, average: 0 };

    const creditsStr = this.formatNumber(credits, 4);
    const priceAvg = this.formatCurrency(price.average || 0);
    const priceRange = `${this.formatCurrency(price.min || 0)} — ${this.formatCurrency(price.max || 0)}`;

    const html = `
      <div class="carbon-credits_grid">
        <div class="carbon-credits_card">
          <p class="carbon-credits_label">Créditos necessários</p>
          <p class="carbon-credits_value">${creditsStr}</p>
          <p class="carbon-credits_hint">1 crédito = 1000 kg CO₂</p>
        </div>

        <div class="carbon-credits_card">
          <p class="carbon-credits_label">Preço estimado</p>
          <p class="carbon-credits_value">${priceAvg}</p>
          <p class="carbon-credits_hint">Faixa: ${priceRange}</p>
        </div>
      </div>

      <div class="carbon-credits_info">
        <strong>ℹ️ Créditos de Carbono</strong>
        <p>Créditos de carbono são instrumentos que representam a remoção ou redução de 1 tonelada de CO₂ equivalente. Use-os para compensar as emissões geradas pela sua viagem.</p>
      </div>

      <button class="carbon-credits_btn">🛒 Compensar Emissão</button>
    `;

    return html;
  },

  /*
   * showLoading / hideLoading
   * - Replaces button content with a spinner and disabled state while preserving original text.
   */
  showLoading: function(buttonElement) {
    if (!buttonElement) return;
    // Save original text
    if (!buttonElement.dataset.originalText) buttonElement.dataset.originalText = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
  },

  hideLoading: function(buttonElement) {
    if (!buttonElement) return;
    buttonElement.disabled = false;
    const original = buttonElement.dataset.originalText || 'Calcular Emissão';
    buttonElement.innerHTML = original;
  }
};
