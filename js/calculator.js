/**
 * Calculator - Global object for emission calculations
 *
 * Provides methods to calculate CO2 emissions for different transport modes,
 * compare modes against car baseline, compute savings, and estimate
 * carbon credits & pricing.
 */

const Calculator = {
  /**
   * Calculate emission (kg CO2) for a given distance and transport mode.
   * Uses CONFIG.EMISSION_FACTORS to obtain kg CO2 per km.
   * Rounds result to 2 decimal places.
   *
   * @param {number} distanceKm - Distance in kilometers
   * @param {string} transportMode - Mode key (e.g., 'car', 'bus')
   * @returns {number} Emission in kg CO2 (rounded to 2 decimals)
   */
  calculateEmission: function(distanceKm, transportMode) {
    const factor = (CONFIG && CONFIG.EMISSION_FACTORS && CONFIG.EMISSION_FACTORS[transportMode]) || 0;
    const emission = Number(distanceKm) * Number(factor);
    return Number.isFinite(emission) ? parseFloat(emission.toFixed(2)) : 0.00;
  },

  /**
   * Calculate emissions for all transport modes and compare vs car baseline.
   * For each mode returns: { mode, emission, percentageVsCar }
   * - percentageVsCar: (emission / carEmission) * 100
   * Results are sorted by emission (lowest first).
   *
   * @param {number} distanceKm
   * @returns {Array<Object>} Sorted array of results for each mode
   */
  calculateAllModes: function(distanceKm) {
    const factors = (CONFIG && CONFIG.EMISSION_FACTORS) || {};
    const modes = Object.keys(factors);
    const results = [];

    // Compute car emission as baseline (if car is present)
    const carEmission = this.calculateEmission(distanceKm, 'car');

    modes.forEach((mode) => {
      const emission = this.calculateEmission(distanceKm, mode);

      // Compute percentage vs car baseline. If carEmission is 0, set percentage to null.
      let percentageVsCar = null;
      if (carEmission > 0) {
        percentageVsCar = (emission / carEmission) * 100;
        percentageVsCar = parseFloat(percentageVsCar.toFixed(2));
      }

      results.push({
        mode: mode,
        emission: emission,
        percentageVsCar: percentageVsCar,
      });
    });

    // Sort by emission (ascending)
    results.sort((a, b) => a.emission - b.emission);

    return results;
  },

  /**
   * Calculate savings compared to a baseline emission.
   * - savedKg = baselineEmission - emission
   * - percentage = (savedKg / baselineEmission) * 100
   * Returns values rounded to 2 decimals.
   *
   * @param {number} emission - Emission to compare (kg)
   * @param {number} baselineEmission - Baseline emission (kg)
   * @returns {Object} { savedKg, percentage }
   */
  calculateSavings: function(emission, baselineEmission) {
    const baseline = Number(baselineEmission) || 0;
    const current = Number(emission) || 0;

    const savedKg = baseline - current;
    const savedKgRounded = parseFloat(savedKg.toFixed(2));

    let percentage = 0;
    if (baseline > 0) {
      percentage = (savedKg / baseline) * 100;
      percentage = parseFloat(percentage.toFixed(2));
    } else {
      percentage = 0.00;
    }

    return {
      savedKg: savedKgRounded,
      percentage: percentage,
    };
  },

  /**
   * Calculate required carbon credits for a given emission (kg CO2).
   * Uses CONFIG.CARBON_CREDIT.KG_PER_CREDIT to convert kg to credits.
   * Returns credits rounded to 4 decimal places.
   *
   * @param {number} emissionKg
   * @returns {number} credits (rounded to 4 decimals)
   */
  calculateCarbonCredits: function(emissionKg) {
    const kgPerCredit = (CONFIG && CONFIG.CARBON_CREDIT && CONFIG.CARBON_CREDIT.KG_PER_CREDIT) || 1000;
    const credits = (Number(emissionKg) || 0) / Number(kgPerCredit);
    return Number.isFinite(credits) ? parseFloat(credits.toFixed(4)) : 0.0000;
  },

  /**
   * Estimate credit price range and average for a given number of credits.
   * Uses CONFIG.CARBON_CREDIT.PRICE_MIN_USD and PRICE_MAX_USD.
   * Returns { min, max, average } rounded to 2 decimals.
   *
   * @param {number} credits
   * @returns {Object} { min, max, average }
   */
  estimatedCreditPrice: function(credits) {
    const priceMin = (CONFIG && CONFIG.CARBON_CREDIT && CONFIG.CARBON_CREDIT.PRICE_MIN_USD) || 0;
    const priceMax = (CONFIG && CONFIG.CARBON_CREDIT && CONFIG.CARBON_CREDIT.PRICE_MAX_USD) || 0;

    const c = Number(credits) || 0;
    const min = c * Number(priceMin);
    const max = c * Number(priceMax);
    const avg = (min + max) / 2;

    return {
      min: parseFloat(min.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
      average: parseFloat(avg.toFixed(2)),
    };
  },
};
