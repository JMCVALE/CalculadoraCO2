/**
 * RoutesDB - Integração com Google Maps Distance Matrix API
 * 
 * Calcula distância entre cidades usando Google Maps Distance Matrix API
 * Requer chave de API configurada em GOOGLE_MAPS_API_KEY
 */

const RoutesDB = {
  // Chave da API do Google Maps (configure no index.html)
  apiKey: typeof GOOGLE_MAPS_API_KEY !== 'undefined' ? GOOGLE_MAPS_API_KEY : '',

  /**
   * Calcula distância entre duas cidades via Google Maps Distance Matrix API
   * 
   * @param {string} origin - Cidade de origem (ex: "São Paulo, SP")
   * @param {string} destination - Cidade de destino (ex: "Rio de Janeiro, RJ")
   * @returns {Promise<number|null>} Distância em km ou null se erro
   */
  findDistance: async function(origin, destination) {
    try {
      // Validar chave de API
      if (!this.apiKey) {
        console.error('❌ Erro: Chave de API do Google Maps não configurada!');
        console.error('Configure a chave em index.html antes do script routes-data.js');
        alert('⚠️ API não configurada. Siga as instruções em API_CONFIG.md');
        return null;
      }

      // Validar entrada
      if (!origin || !destination) {
        console.warn('⚠️ Origem ou destino vazio');
        return null;
      }

      console.log(`🔍 Buscando distância: ${origin} → ${destination}`);

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

      // Verificar status da resposta
      if (data.status !== 'OK') {
        console.error(`❌ Erro da API: ${data.status}`);
        
        if (data.status === 'REQUEST_DENIED') {
          alert('❌ Erro: Chave de API inválida ou permissões insuficientes');
        } else if (data.status === 'ZERO_RESULTS') {
          alert('❌ Rota não encontrada. Verifique os nomes das cidades.');
        } else if (data.status === 'OVER_QUERY_LIMIT') {
          alert('❌ Limite de requisições excedido. Tente novamente amanhã.');
        }
        
        return null;
      }

      // Extrair resultado
      if (data.rows && data.rows.length > 0 && data.rows[0].elements && data.rows[0].elements.length > 0) {
        const element = data.rows[0].elements[0];

        if (element.status === 'OK') {
          // Converter metros para quilômetros
          const distanceKm = element.distance.value / 1000;
          const distanceRounded = parseFloat(distanceKm.toFixed(2));
          
          console.log(`✅ Distância encontrada: ${distanceRounded} km`);
          return distanceRounded;
        } else if (element.status === 'ZERO_RESULTS') {
          console.warn('⚠️ Rota não encontrada');
          alert('❌ Rota não encontrada. Verifique os nomes das cidades.');
          return null;
        }
      }

      console.warn('⚠️ Resposta inesperada da API');
      return null;
    } catch (err) {
      console.error('❌ Erro ao buscar distância:', err);
      alert('❌ Erro de conexão. Verifique sua internet e tente novamente.');
      return null;
    }
  },

  /**
   * Retorna todas as cidades (placeholder - com API dinâmica não há lista fixa)
   * Para autocomplete, considere usar Geocoding API do Google
   * @returns {array} Array vazio (dinâmico com API)
   */
  getAllCities: function() {
    console.warn('⚠️ Nota: Com API dinâmica, use Geocoding para autocomplete');
    return [];
  },
};
