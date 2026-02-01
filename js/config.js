/**
 * CONFIG - Global configuration object
 */

const CONFIG = {
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96,
  },

  TRANSPORT_MODES: {
    bicycle: { label: "Bicicleta", icon: "🚲", color: "#3b82f6" },
    car: { label: "Carro", icon: "🚗", color: "#ef4444" },
    bus: { label: "Ônibus", icon: "🚌", color: "#f59e0b" },
    truck: { label: "Caminhão", icon: "🚚", color: "#8b5cf6" },
  },

  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_USD: 50,
    PRICE_MAX_USD: 150,
  },

  /**
   * Preenche o datalist com cidades disponíveis
   */
  populateDetails: function () {
    const datalist = document.getElementById("city-list");
    if (!datalist) return;

    datalist.innerHTML = "";

    RoutesDB.getAllCities().forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      datalist.appendChild(option);
    });
  },

  /**
   * Configura preenchimento automático da distância
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

    const cities = RoutesDB.getAllCities();

    const isValidCity = (value) => cities.includes(value);

    const resetDistance = (message) => {
      distanceInput.value = "";
      distanceInput.readOnly = false;
      manualCheckbox.checked = true;
      helperText.textContent = message;
      helperText.style.color = "#f59e0b";
      helperText.style.fontWeight = "500";
    };

    const tryFillDistance = () => {
      const origin = originInput.value.trim();
      const destination = destinationInput.value.trim();

      if (!origin || !destination) {
        resetDistance("Digite origem e destino");
        return;
      }

      if (!isValidCity(origin) || !isValidCity(destination)) {
        resetDistance("Selecione uma cidade válida da lista");
        return;
      }

      const distance = RoutesDB.findDistance(origin, destination);

      if (distance !== null) {
        distanceInput.value = distance;
        distanceInput.readOnly = true;
        manualCheckbox.checked = false;

        helperText.textContent = `✅ Distância encontrada: ${distance} km`;
        helperText.style.color = "#10b981";
        helperText.style.fontWeight = "600";
      } else {
        resetDistance("⚠️ Rota não cadastrada. Digite a distância manualmente.");
      }
    };

    // reagir enquanto digita
    originInput.addEventListener("input", tryFillDistance);
    destinationInput.addEventListener("input", tryFillDistance);

    manualCheckbox.addEventListener("change", () => {
      if (manualCheckbox.checked) {
        distanceInput.readOnly = false;
        distanceInput.value = "";
        helperText.textContent = "Digite a distância em quilômetros";
        helperText.style.color = "inherit";
        helperText.style.fontWeight = "normal";
        distanceInput.focus();
      } else {
        tryFillDistance();
      }
    });
  },
};
