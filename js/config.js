/**
 * CONFIG - Global configuration object
 * 
 * Contains emission factors, transport mode metadata, carbon credit data,
 * and setup methods for initializing the calculator UI.
 */

const CONFIG = {
  /**
   * Emission factors in kg CO2 per kilometer
   */
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96,
  },

  /**
   * Transport modes metadata
   */
  TRANSPORT_MODES: {
    bicycle: { label: "Bicicleta", icon: "🚲", color: "#3b82f6" },
    car: { label: "Carro", icon: "🚗", color: "#ef4444" },
    bus: { label: "Ônibus", icon: "🚌", color: "#f59e0b" },
    truck: { label: "Caminhão", icon: "🚚", color: "#8b5cf6" },
  },

  /**
   * Carbon credit pricing and conversion data
   */
  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_USD: 50,
    PRICE_MAX_USD: 150,
  },

  /**
   * Populates the datalist with all available cities from RoutesDB
   */
  populateDetails: function() {
    try {
      const cities = RoutesDB.getAllCities();
      const datalist = document.getElementById("city-list");

      if (!datalist) return;

      datalist.innerHTML = "";

      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        datalist.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao popular datalist:", error);
    }
  },

  /**
   * Configura preenchimento automático de distância
   * usando base local (RoutesDB)
   */
  setupDistanceAutofill: function() {
    try {
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
          distanceInput.value = "";
          helperText.textContent = "Digite origem e destino";
          helperText.style.color = "inherit";
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
          distanceInput.value = "";
          distanceInput.readOnly = false;
          manualCheckbox.checked = true;

          helperText.textContent = "⚠️ Rota não cadastrada. Digite a distância manualmente.";
          helperText.style.color = "#f59e0b";
          helperText.style.fontWeight = "500";
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
          helperText.style.fontWeight = "normal";
          distanceInput.focus();
        } else {
          tryFillDistance();
        }
      });
    } catch (error) {
      console.error("Erro ao configurar preenchimento automático:", error);
    }
  },
};
