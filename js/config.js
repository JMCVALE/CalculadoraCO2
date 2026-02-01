/**
 * CONFIG - Objeto global de configuração
 *
 * Contém fatores de emissão, metadados de transporte,
 * dados de crédito de carbono e métodos de inicialização da UI.
 */

const CONFIG = {
  /**
   * Fatores de emissão em kg de CO₂ por km
   */
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96,
  },

  /**
   * Metadados dos modos de transporte
   */
  TRANSPORT_MODES: {
    bicycle: {
      label: "Bicicleta",
      icon: "🚲",
      color: "#3b82f6",
    },
    car: {
      label: "Carro",
      icon: "🚗",
      color: "#ef4444",
    },
    bus: {
      label: "Ônibus",
      icon: "🚌",
      color: "#f59e0b",
    },
    truck: {
      label: "Caminhão",
      icon: "🚚",
      color: "#8b5cf6",
    },
  },

  /**
   * Configuração de créditos de carbono
   */
  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_USD: 50,
    PRICE_MAX_USD: 150,
  },

  /**
   * Preenche o datalist com as cidades disponíveis
   */
  populateDetails: function () {
    const datalist = document.getElementById("city-list");

    if (!datalist) {
      console.error("Datalist 'city-list' não encontrado");
      return;
    }

    const cities = RoutesDB.getAllCities();
    datalist.innerHTML = "";

    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      datalist.appendChild(option);
    });
  },

  /**
   * Configura o preenchimento automático da distância
   */
  setupDistanceAutofill: function () {
    const originInput = document.getElementById("origin");
    const destinationInput = document.getElementById("destination");
    const distanceInput = document.getElementById("distance");
    const manualCheckbox = document.getElementById("manual-distance");
    const helperText = document.querySelector(".calculator__helper");

    if (!originInput || !destinationInput || !distanceInput || !manualCheckbox || !helperText) {
      console.error("Elementos do formulário não encontrados");
      return;
    }

    const tryFillDistance = () => {
      const origin = originInput.value.trim();
      const destination = destinationInput.value.trim();

      if (!origin || !destination) {
        return;
      }

      const distance = RoutesDB.findDistance(origin, destination);

      if (distance !== null) {
        distanceInput.value = distance;
        distanceInput.readOnly = true;
        manualCheckbox.checked = false;

        helperText.textContent = "Distância calculada automaticamente";
        helperText.style.color = "#10b981";
      } else {
        distanceInput.value = "";
        distanceInput.readOnly = false;

        helperText.textContent = "Rota não cadastrada. Insira a distância manualmente.";
        helperText.style.color = "#f59e0b";
      }
    };

    originInput.addEventListener("change", tryFillDistance);
    destinationInput.addEventListener("change", tryFillDistance);

    manualCheckbox.addEventListener("change", () => {
      if (manualCheckbox.checked) {
        distanceInput.readOnly = false;
        distanceInput.value = "";
        helperText.textContent = "Digite a distância em quilômetros";
        helperText.style.color = "inherit";
      } else {
        tryFillDistance();
      }
    });
  },
};
