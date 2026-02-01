/**
 * RoutesDB - Banco de Dados Local de Rotas
 * 
 * Contém rotas pré-cadastradas entre principais cidades brasileiras
 * Sem dependência de APIs externas
 */

const RoutesDB = {
  /**
   * Array de rotas
   * Cada rota contém:
   * - origin: Cidade de origem com estado (ex: "São Paulo, SP")
   * - destination: Cidade de destino com estado
   * - distanceKm: Distância em quilômetros
   */
  routes: [
    // Região Sudeste
    { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 99 },
    { origin: "São Paulo, SP", destination: "Ribeirão Preto, SP", distanceKm: 313 },
    { origin: "São Paulo, SP", destination: "São José dos Campos, SP", distanceKm: 97 },
    { origin: "São Paulo, SP", destination: "Santos, SP", distanceKm: 72 },
    { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 22 },
    { origin: "Rio de Janeiro, RJ", destination: "Campos dos Goytacazes, RJ", distanceKm: 279 },
    { origin: "Rio de Janeiro, RJ", destination: "Volta Redonda, RJ", distanceKm: 127 },
    { origin: "Belo Horizonte, MG", destination: "Uberlândia, MG", distanceKm: 556 },
    { origin: "Belo Horizonte, MG", destination: "Juiz de Fora, MG", distanceKm: 272 },
    { origin: "Belo Horizonte, MG", destination: "Montes Claros, MG", distanceKm: 422 },
    { origin: "Vitória, ES", destination: "Belo Horizonte, MG", distanceKm: 524 },
    { origin: "Vitória, ES", destination: "Rio de Janeiro, RJ", distanceKm: 521 },
    { origin: "Vitória, ES", destination: "São Paulo, SP", distanceKm: 882 },

    // Região Nordeste
    { origin: "Salvador, BA", destination: "Maceió, AL", distanceKm: 632 },
    { origin: "Salvador, BA", destination: "Aracaju, SE", distanceKm: 356 },
    { origin: "Salvador, BA", destination: "João Pessoa, PB", distanceKm: 949 },
    { origin: "Salvador, BA", destination: "Natal, RN", distanceKm: 1126 },
    { origin: "Recife, PE", destination: "João Pessoa, PB", distanceKm: 120 },
    { origin: "Recife, PE", destination: "Maceió, AL", distanceKm: 257 },
    { origin: "Recife, PE", destination: "Natal, RN", distanceKm: 297 },
    { origin: "Recife, PE", destination: "Aracaju, SE", distanceKm: 501 },
    { origin: "Fortaleza, CE", destination: "Natal, RN", distanceKm: 537 },
    { origin: "Fortaleza, CE", destination: "João Pessoa, PB", distanceKm: 688 },
    { origin: "Fortaleza, CE", destination: "Teresina, PI", distanceKm: 634 },
    { origin: "Fortaleza, CE", destination: "São Luís, MA", distanceKm: 1070 },
    { origin: "São Luís, MA", destination: "Teresina, PI", distanceKm: 446 },
    { origin: "Maceió, AL", destination: "Aracaju, SE", distanceKm: 294 },
    { origin: "Maceió, AL", destination: "João Pessoa, PB", distanceKm: 395 },
    { origin: "João Pessoa, PB", destination: "Natal, RN", distanceKm: 185 },
    { origin: "Natal, RN", destination: "Mossoró, RN", distanceKm: 281 },

    // Região Sul
    { origin: "Curitiba, PR", destination: "Porto Alegre, RS", distanceKm: 710 },
    { origin: "São Paulo, SP", destination: "Curitiba, PR", distanceKm: 408 },
    { origin: "Curitiba, PR", destination: "Rio de Janeiro, RJ", distanceKm: 1100 },
    { origin: "Porto Alegre, RS", destination: "Rio de Janeiro, RJ", distanceKm: 1838 },

    // Região Centro-Oeste e Norte
    { origin: "Manaus, AM", destination: "Brasília, DF", distanceKm: 2230 },
    { origin: "Manaus, AM", destination: "Belém, PA", distanceKm: 1427 },
    { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKm: 209 },
    { origin: "Brasília, DF", destination: "Cuiabá, MT", distanceKm: 918 },
    { origin: "São Paulo, SP", destination: "Cuiabá, MT", distanceKm: 1715 },
    { origin: "Brasília, DF", destination: "Porto Alegre, RS", distanceKm: 2179 },
    { origin: "Goiânia, GO", destination: "Belo Horizonte, MG", distanceKm: 699 },
    { origin: "Belém, PA", destination: "Fortaleza, CE", distanceKm: 1842 },
    { origin: "São Paulo, SP", destination: "Salvador, BA", distanceKm: 2085 },
    { origin: "São Paulo, SP", destination: "Recife, PE", distanceKm: 2375 },
    { origin: "São Paulo, SP", destination: "Fortaleza, CE", distanceKm: 2865 },
    { origin: "Rio de Janeiro, RJ", destination: "Curitiba, PR", distanceKm: 1100 },
    { origin: "Rio de Janeiro, RJ", destination: "Porto Alegre, RS", distanceKm: 1838 },
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
   * Retorna todas as cidades únicas cadastradas
   * @returns {array} Array ordenado alfabeticamente
   */
  getAllCities: function() {
    const citiesSet = new Set();
    
    this.routes.forEach((route) => {
      citiesSet.add(route.origin);
      citiesSet.add(route.destination);
    });

    return Array.from(citiesSet).sort();
  },

  /**
   * Busca a distância entre duas cidades
   * Funciona bidirecional (origem→destino ou destino→origem)
   * 
   * @param {string} origin - Cidade de origem
   * @param {string} destination - Cidade de destino
   * @returns {number|null} Distância em km ou null se não encontrada
   */
  findDistance: function(origin, destination) {
    // Normalizar inputs
    const normalizedOrigin = origin.trim().toLowerCase();
    const normalizedDestination = destination.trim().toLowerCase();

    // Buscar em ambas as direções
    const route = this.routes.find((r) => {
      const routeOriginLower = r.origin.toLowerCase();
      const routeDestinationLower = r.destination.toLowerCase();

      return (
        (routeOriginLower === normalizedOrigin && routeDestinationLower === normalizedDestination) ||
        (routeOriginLower === normalizedDestination && routeDestinationLower === normalizedOrigin)
      );
    });

    return route ? route.distanceKm : null;
  },
};
