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
   * Sets up automatic distance filling based on origin and destination
   * Listens to changes in origin/destination inputs and manual distance checkbox
   */
  setupDistanceAutofill: function() {
    try {
      // Get form elements
      const originInput = document.getElementById("origin");
      const destinationInput = document.getElementById("destination");
      const distanceInput = document.getElementById("distance");
      const manualCheckbox = document.getElementById("manual-distance");
      const helperText = document.querySelector(".calculator__helper");

      if (!originInput || !destinationInput || !distanceInput || !manualCheckbox || !helperText) {
        console.error("Required form elements not found");
        return;
      }

      /**
       * Helper function to attempt finding and filling distance
       */
      const tryFillDistance = () => {
        const origin = originInput.value.trim();
        const destination = destinationInput.value.trim();

        // Only proceed if both cities are filled
        if (!origin || !destination) {
          distanceInput.value = "";
          helperText.textContent = "Distância será preenchida automaticamente";
          helperText.style.color = "inherit";
          return;
        }

        // Find distance using RoutesDB
        const distance = RoutesDB.findDistance(origin, destination);

        if (distance !== null) {
          // Distance found - fill the input and make it readonly
          distanceInput.value = distance;
          distanceInput.readOnly = true;
          manualCheckbox.checked = false;
          
          // Update helper text to green success message
          helperText.textContent = `Distância encontrada: ${distance} km`;
          helperText.style.color = "#10b981"; // Primary green
          helperText.style.fontWeight = "600";
        } else {
          // Distance not found - clear and suggest manual input
          distanceInput.value = "";
          distanceInput.readOnly = false;
          
          // Update helper text with suggestion
          helperText.textContent = "Rota não encontrada. Verifique sua entrada ou ative a entrada de distância manual.";
          helperText.style.color = "#f59e0b"; // Warning orange
          helperText.style.fontWeight = "500";
        }
      };

      // Add 'change' event listeners to origin and destination inputs
      originInput.addEventListener("change", tryFillDistance);
      destinationInput.addEventListener("change", tryFillDistance);

      // Add 'change' listener to manual distance checkbox
      manualCheckbox.addEventListener("change", () => {
        if (manualCheckbox.checked) {
          // Enable manual entry
          distanceInput.readOnly = false;
          distanceInput.value = "";
          helperText.textContent = "Digite a distância manualmente (em quilômetros)";
          helperText.style.color = "inherit";
          helperText.style.fontWeight = "normal";
          distanceInput.focus();
        } else {
          // Try to find route again
          tryFillDistance();
        }
      });

      console.log("Distance autofill setup complete");
    } catch (error) {
      console.error("Error setting up distance autofill:", error);
    }
  },
};
