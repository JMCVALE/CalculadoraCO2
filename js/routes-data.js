/**
 * RoutesDB - Global database of transportation routes
 * 
 * Banco de dados de rotas entre cidades brasileiras com suporte a:
 * - Dados locais pré-cadastrados (rotas principais)
 * - Google Maps Distance Matrix API (cálculo em tempo real para qualquer rota)
 * 
 * Uso:
 * RoutesDB.findDistance("São Paulo, SP", "Rio de Janeiro, RJ")
 * RoutesDB.findDistanceViaAPI("São Paulo, SP", "Rio de Janeiro, RJ")
 */

const RoutesDB = {
  // Configuração da API (usar variável global ou environment)
  apiKey: typeof GOOGLE_MAPS_API_KEY !== 'undefined' ? GOOGLE_MAPS_API_KEY : '',
  /**
   * Array of route objects
   * Each route contains:
   * - origin: {string} City name with state/province code
   * - destination: {string} City name with state/province code
   * - distanceKm: {number} Distance in kilometers
   */
  routes: [
    // Southeast Brazil (Major Routes)
    { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKm: 429 },
    { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKm: 1015 },
    { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKm: 1150 },
    { origin: "São Paulo, SP", destination: "Belo Horizonte, MG", distanceKm: 586 },
    { origin: "Rio de Janeiro, RJ", destination: "Belo Horizonte, MG", distanceKm: 716 },

    // Northeast Brazil Routes
    { origin: "Salvador, BA", destination: "Fortaleza, CE", distanceKm: 1407 },
    { origin: "Recife, PE", destination: "Fortaleza, CE", distanceKm: 730 },
    { origin: "Salvador, BA", destination: "Recife, PE", distanceKm: 840 },
    { origin: "Salvador, BA", destination: "Rio de Janeiro, RJ", distanceKm: 1614 },
    { origin: "Fortaleza, CE", destination: "Rio de Janeiro, RJ", distanceKm: 2403 },

    // South Brazil Routes
    { origin: "Curitiba, PR", destination: "Porto Alegre, RS", distanceKm: 710 },
    { origin: "São Paulo, SP", destination: "Curitiba, PR", distanceKm: 408 },
    { origin: "Curitiba, PR", destination: "Rio de Janeiro, RJ", distanceKm: 1100 },
    { origin: "Porto Alegre, RS", destination: "Rio de Janeiro, RJ", distanceKm: 1838 },

    // North/Center-West Brazil Routes
    { origin: "Manaus, AM", destination: "Brasília, DF", distanceKm: 2230 },
    { origin: "Manaus, AM", destination: "Belém, PA", distanceKm: 1427 },
    { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKm: 209 },
    { origin: "Brasília, DF", destination: "Cuiabá, MT", distanceKm: 918 },

    // Interior Routes
    { origin: "São Paulo, SP", destination: "Cuiabá, MT", distanceKm: 1715 },
    { origin: "Brasília, DF", destination: "Porto Alegre, RS", distanceKm: 2179 },
    { origin: "Goiânia, GO", destination: "Belo Horizonte, MG", distanceKm: 699 },
    { origin: "Belém, PA", destination: "Fortaleza, CE", distanceKm: 1842 },

    // Major Hub Connections
    { origin: "São Paulo, SP", destination: "Salvador, BA", distanceKm: 2085 },
    { origin: "São Paulo, SP", destination: "Recife, PE", distanceKm: 2375 },
    { origin: "São Paulo, SP", destination: "Fortaleza, CE", distanceKm: 2865 },
    { origin: "Rio de Janeiro, RJ", destination: "Curitiba, PR", distanceKm: 1100 },
    { origin: "Rio de Janeiro, RJ", destination: "Porto Alegre, RS", distanceKm: 1838 },

    // Additional Major Routes
    { origin: "Brasília, DF", destination: "Salvador, BA", distanceKm: 1621 },
    { origin: "Belo Horizonte, MG", destination: "Brasília, DF", distanceKm: 716 },
    { origin: "Brasília, DF", destination: "Rio de Janeiro, RJ", distanceKm: 1150 },
    { origin: "São Paulo, SP", destination: "Porto Alegre, RS", distanceKm: 1505 },
    { origin: "Manaus, AM", destination: "Rio de Janeiro, RJ", distanceKm: 3580 },
    { origin: "Belém, PA", destination: "Rio de Janeiro, RJ", distanceKm: 2870 },
    { origin: "Recife, PE", destination: "Rio de Janeiro, RJ", distanceKm: 2346 },
    { origin: "Fortaleza, CE", destination: "Brasília, DF", distanceKm: 2264 },
  ],

  /**
   * Retrieves all unique cities from the routes database
   * @returns {array} Sorted array of unique city names
   */
  getAllCities: function() {
    const citiesSet = new Set();
    
    this.routes.forEach((route) => {
      citiesSet.add(route.origin);
      citiesSet.add(route.destination);
    });

    // Convert Set to Array and sort alphabetically
    return Array.from(citiesSet).sort();
  },

  /**
   * Finds the distance between two cities
   * Searches bidirectionally (origin-destination and destination-origin)
   * @param {string} origin - Starting city name
   * @param {string} destination - Ending city name
   * @returns {number|null} Distance in kilometers if found, null otherwise
   */
  findDistance: function(origin, destination) {
    // Normalize inputs: trim whitespace and convert to lowercase for comparison
    const normalizedOrigin = origin.trim().toLowerCase();
    const normalizedDestination = destination.trim().toLowerCase();

    // Search in both directions
    const route = this.routes.find((r) => {
      const routeOriginLower = r.origin.toLowerCase();
      const routeDestinationLower = r.destination.toLowerCase();

      return (
        (routeOriginLower === normalizedOrigin && routeDestinationLower === normalizedDestination) ||
        (routeOriginLower === normalizedDestination && routeDestinationLower === normalizedOrigin)
      );
    });

    // Return distance if found, otherwise return null
    return route ? route.distanceKm : null;
  },

  /**
   * Busca distância via Google Maps Distance Matrix API
   * Funciona para qualquer par de cidades, não apenas rotas pré-cadastradas
   * 
   * @param {string} origin - Cidade de origem
   * @param {string} destination - Cidade de destino
   * @returns {Promise<number|null>} Promise resolvida com distância em km ou null se erro
   */
  findDistanceViaAPI: async function(origin, destination) {
    try {
      // Validar chave de API
      if (!this.apiKey) {
        console.warn('Google Maps API key não configurada. Use dados locais ou configure a chave.');
        return null;
      }

      // Construir URL da API
      const params = new URLSearchParams({
        origins: origin,
        destinations: destination,
        key: this.apiKey,
        units: 'metric'
      });

      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${params}`;

      // Fazer requisição
      const response = await fetch(url);
      const data = await response.json();

      // Verificar se houve erro
      if (data.status !== 'OK') {
        console.warn(`Google Maps API error: ${data.status}`);
        return null;
      }

      // Verificar resultados
      if (data.rows && data.rows.length > 0 && data.rows[0].elements && data.rows[0].elements.length > 0) {
        const element = data.rows[0].elements[0];

        if (element.status === 'OK') {
          // Converter metros para quilômetros
          const distanceKm = element.distance.value / 1000;
          return parseFloat(distanceKm.toFixed(2));
        }
      }

      return null;
    } catch (err) {
      console.error('Erro ao buscar distância via Google Maps API:', err);
      return null;
    }
  },

  /**
   * Busca distância com fallback automático (local → API)
   * Primeiro tenta dados locais, se não encontrar tenta API
   * 
   * @param {string} origin - Cidade de origem
   * @param {string} destination - Cidade de destino
   * @returns {Promise<number|null>} Distância em km ou null
   */
  findDistanceWithFallback: async function(origin, destination) {
    // Primeiro, tentar dados locais (rápido)
    const localDistance = this.findDistance(origin, destination);
    if (localDistance !== null) {
      return localDistance;
    }

    // Se não encontrar, tentar API (mais lento mas abrange qualquer rota)
    const apiDistance = await this.findDistanceViaAPI(origin, destination);
    return apiDistance;
  },
};