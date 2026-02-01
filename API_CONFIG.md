# 🔧 Configuração Google Maps Distance Matrix API

Este documento explica como integrar a Google Maps Distance Matrix API para calcular distâncias em tempo real entre qualquer par de cidades brasileiras.

## 🤔 Por que usar a API?

- ✅ **Abrange qualquer rota** - Não se limita ao banco de dados local
- ✅ **Preciso e atualizado** - Usa dados do Google Maps
- ✅ **Dinâmico** - Funciona em tempo real
- ❌ Requer chave de API (gratuita para primeiros 25.000 requisições/dia)

## 📋 Passo 1: Obter a Chave de API

### 1.1 Criar um projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Faça login com sua conta Google
3. Crie um novo projeto:
   - Clique em "Selecione um projeto" → "Novo projeto"
   - Nome: `CO2 Calculator` (ou outro nome desejado)
   - Clique em "Criar"

### 1.2 Habilitar a API

1. Na busca superior, procure por "Distance Matrix API"
2. Clique na "Distance Matrix API"
3. Clique em "ATIVAR"

### 1.3 Criar credenciais (Chave de API)

1. No menu lateral, vá para "Credenciais"
2. Clique em "Criar Credenciais" → "Chave de API"
3. Uma nova chave será gerada (exemplo: `AIzaSyD_WH...`)
4. **Copie e guarde esta chave em lugar seguro!**

### 1.4 Configurar restrições (Opcional, Recomendado)

Para segurança, restrinja sua chave:

1. Clique na chave criada
2. Em "Restrições de HTTP referrer", adicione:
   ```
   https://SEU_USUARIO.github.io/CalculadoraCO2/*
   ```
3. Em "Restrições de API", selecione apenas "Distance Matrix API"
4. Clique em "Salvar"

## 🔐 Passo 2: Configurar a Chave no Projeto

### Opção A: Variável Global em HTML

Adicione ao `index.html` **antes** de carregar os scripts:

```html
<script>
  window.GOOGLE_MAPS_API_KEY = 'AIzaSyD_SUA_CHAVE_AQUI';
</script>
```

**Localização exata no index.html:**

```html
<head>
	<!-- ... outros head items ... -->
	<script>
	  window.GOOGLE_MAPS_API_KEY = 'AIzaSyD_SUA_CHAVE_AQUI';
	</script>
	<script src="js/routes-data.js"></script>
	<!-- ... -->
</head>
```

### Opção B: Modificar routes-data.js

Abra `js/routes-data.js` e mude:

```javascript
const RoutesDB = {
  // Antes:
  apiKey: typeof GOOGLE_MAPS_API_KEY !== 'undefined' ? GOOGLE_MAPS_API_KEY : '',

  // Depois:
  apiKey: 'AIzaSyD_SUA_CHAVE_AQUI',
```

⚠️ **NÃO RECOMENDADO**: Expõe a chave publicamente no repositório!

### Opção C: Environment Variables (Melhor para GitHub Pages)

Ainda não implementado, mas considere usar:
- GitHub Secrets (se usar GitHub Actions para build)
- Servidores proxy privados
- Funções serverless (Netlify Functions, Vercel, etc.)

## 🧪 Passo 3: Testar a Integração

### Teste 1: Verificar se a API está configurada

1. Abra o console do navegador (F12)
2. Rode este comando:

```javascript
console.log('API Key:', RoutesDB.apiKey);
```

Deveria mostrar sua chave (ou vazio se não configurada).

### Teste 2: Testar uma requisição

1. No console, rode:

```javascript
RoutesDB.findDistanceViaAPI("São Paulo, SP", "Rio de Janeiro, RJ")
  .then(distance => console.log('Distância:', distance + ' km'))
  .catch(err => console.error('Erro:', err));
```

Deveria retornar algo como: `Distância: 429 km`

### Teste 3: Testar o fallback automático

1. No console, rode:

```javascript
RoutesDB.findDistanceWithFallback("São Paulo, SP", "Rio de Janeiro, RJ")
  .then(distance => console.log('Distância (com fallback):', distance + ' km'))
  .catch(err => console.error('Erro:', err));
```

## 🔄 Como a Integração Funciona

### Fluxo de Busca de Distância

```
usuario digita origem e destino
                ↓
setupDistanceAutofill() é chamado
                ↓
RoutesDB.findDistance() busca em dados locais
                ↓
        Se encontrar → retorna (rápido)
        Se não encontrar → tenta API
                ↓
  RoutesDB.findDistanceViaAPI() busca no Google Maps
                ↓
   Se API disponível → retorna distância
   Se não disponível → mostra erro "rota não encontrada"
```

### Implementação no config.js

O arquivo `config.js` foi **automáticamente atualizado** para usar o novo sistema. Não precisa alterar nada lá!

## 📊 Limites Gratuitos

- **25.000 requisições/dia** - Suffciente para a maioria dos projetos
- Depois disso: $5 por 1.000 requisições adicionais
- Você recebe alertas do Google Cloud quando está perto do limite

## 🚨 Troubleshooting

### Erro: "Google Maps API key não configurada"

**Solução:** Configure a chave seguindo o Passo 2 acima.

### Erro: "ZERO_RESULTS"

**Causa:** Cidade não encontrada no Google Maps  
**Solução:** Verifique a grafia (incluindo estado/região)  
Exemplo correto: "São Paulo, SP" e não "Sao Paulo"

### Erro: "REQUEST_DENIED"

**Causa:** Chave inválida ou permissões insuficientes  
**Solução:**
1. Verifique se a chave está correta
2. Certifique-se que "Distance Matrix API" está ativada
3. Aguarde ~5 minutos após ativar a API

### Erro: "OVER_QUERY_LIMIT"

**Causa:** Você excedeu o limite gratuito de 25.000 requisições/dia  
**Solução:** Aguarde até o próximo dia ou ative o plano pago

### Erro: CORS (Cross-Origin)

**Causa:** Navegador bloqueou requisição (restrição de segurança)  
**Solução:** Adicione o domínio às restrições HTTP referrer da sua chave API

## 🎯 Boas Práticas

1. ✅ **Use variáveis de ambiente** - Não exponha chaves em código
2. ✅ **Restrinja por domínio** - Configure HTTP referrer restrictions
3. ✅ **Monitore uso** - Verifique Google Cloud Console regularmente
4. ✅ **Implemente cache** - Evite requisições repetidas
5. ✅ **Tenha fallback** - Use dados locais quando possível

## 📚 Documentação Oficial

- [Google Maps Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Guia de Autenticação](https://developers.google.com/maps/documentation/javascript/get-api-key)

## ❓ FAQ

**P: Minha chave vai vazar se colocar no index.html?**  
R: Sim! Use as restrições de HTTP referrer para limitar ao seu domínio.

**P: Posso usar sem a API?**  
R: Sim! O sistema funciona 100% com dados locais. A API é opcional para estender alcance.

**P: A API é realmente gratuita?**  
R: Sim, 25.000 requisições/dia são grátis. Depois disso, você paga por uso.

**P: Como diminuo o uso de requisições?**  
R: Implemente cache local das rotas buscadas para evitar buscar a mesma rota múltiplas vezes.

---

**Última atualização:** Janeiro 2026  
**Desenvolvido para:** Calculadora de Emissão de CO² por Júlia Vale
