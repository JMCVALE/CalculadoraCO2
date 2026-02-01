/**
 * CONFIG - Global configuration object
 * 
 * Contains emission factors, transport mode metadata, carbon credit data,
 * and setup methods for initializing the calculator UI.
 */

const CONFIG = {
  /**
   * Emission factors in kg CO2 per kilometer
   * Based on average emissions for different transport modes
   */
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96,
  },

  /**
   * Transport modes metadata
   * Contains UI labels, icons, and colors for each transport type
   */
  TRANSPORT_MODES: {
    bicycle: {
      label: "Bicicleta",
      icon: "🚲",
      color: "#3b82f6", // Blue
    },
    car: {
      label: "Carro",
      icon: "🚗",
      color: "#ef4444", // Red
    },
    bus: {
      label: "Ônibus",
      icon: "🚌",
      color: "#f59e0b", // Orange
    },
    truck: {
      label: "Caminhão",
      icon: "🚚",
      color: "#8b5cf6", // Purple
    },
  },

  /**
   * Carbon credit pricing and conversion data
   */
  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000, // 1 carbon credit = 1000 kg CO2
    PRICE_MIN_USD: 50,   // Minimum price per credit in USD
    PRICE_MAX_USD: 150,  // Maximum price per credit in USD
  },

  /**
   * Populates the datalist with all available cities from RoutesDB
   * Creates option elements for autocomplete functionality
   */
  populateDetails: function() {
    try {
      // Get all cities from routes database
      const cities = RoutesDB.getAllCities();
      
      // Get the datalist element
      const datalist = document.getElementById("city-list");
      
      if (!datalist) {
        console.error("Datalist element with id 'city-list' not found");
        return;
      }

      // Clear existing options
      datalist.innerHTML = "";

      // Create and append option elements for each city
      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        datalist.appendChild(option);
      });

      console.log(`Populated datalist with ${cities.length} cities`);
    } catch (error) {
      console.error("Error populating datalist:", error);
    }
  },

  /**
   * Configura preenchimento automático de distância via Google Maps API
   * Busca distância entre origem e destino usando RoutesDB.findDistance()
   */
  setupDistanceAutofill: function() {
    try {
      // Obter elementos do formulário
      const originInput = document.getElementById("origin");
      const destinationInput = document.getElementById("destination");
      const distanceInput = document.getElementById("distance");
      const manualCheckbox = document.getElementById("manual-distance");
      const helperText = document.querySelector(".calculator__helper");

      if (!originInput || !destinationInput || !distanceInput || !manualCheckbox || !helperText) {
        console.error("Elementos do formulário não encontrados");
        return;
      }

      /**
       * Tenta preencher a distância automaticamente via API
       */
      const tryFillDistance = async () => {
        const origin = originInput.value.trim();
        const destination = destinationInput.value.trim();

        // Validar entrada
        if (!origin || !destination) {
          distanceInput.value = "";
          helperText.textContent = "Digite origem e destino";
          helperText.style.color = "inherit";
          return;
        }

        // Desabilitar input e mostrar carregando
        distanceInput.value = "⏳ Buscando...";
        distanceInput.disabled = true;
        helperText.textContent = "Conectando ao Google Maps...";
        helperText.style.color = "#3b82f6";

        // Buscar distância via API
        const distance = await RoutesDB.findDistance(origin, destination);

        if (distance !== null) {
          // Sucesso: preencher distância
          distanceInput.value = distance;
          distanceInput.readOnly = true;
          manualCheckbox.checked = false;
          
          helperText.textContent = `✅ Distância encontrada: ${distance} km`;
          helperText.style.color = "#10b981";
          helperText.style.fontWeight = "600";
        } else {
          // Erro: permitir entrada manual
          distanceInput.value = "";
          distanceInput.disabled = false;
          distanceInput.readOnly = false;
          
          helperText.textContent = "❌ Rota não encontrada. Digite manualmente ou verifique os nomes.";
          helperText.style.color = "#f59e0b";
          helperText.style.fontWeight = "500";
        }
      };

      // Listeners para mudanças nos inputs
      originInput.addEventListener("change", tryFillDistance);
      destinationInput.addEventListener("change", tryFillDistance);

      // Listener para checkbox de distância manual
      manualCheckbox.addEventListener("change", () => {
        if (manualCheckbox.checked) {
          // Modo manual
          distanceInput.readOnly = false;
          distanceInput.disabled = false;
          distanceInput.value = "";
          helperText.textContent = "Digite a distância em quilômetros";
          helperText.style.color = "inherit";
          helperText.style.fontWeight = "normal";
          distanceInput.focus();
        } else {
          // Tentar buscar automaticamente novamente
          tryFillDistance();
        }
      });

      console.log("✅ Preenchimento automático de distância configurado");
    } catch (error) {
      console.error("Erro ao configurar preenchimento automático:", error);
    }
  },
};
