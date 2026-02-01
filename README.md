# 🌿 Calculadora de Emissão de CO²

Uma aplicação web interativa para calcular e comparar emissões de CO² entre cidades usando diferentes modos de transporte. Ajude a entender o impacto ambiental de suas viagens e compense suas emissões com créditos de carbono.

**Desenvolvido por Júlia Vale com 💚 para DIO | Project GitHub Copilot**

## 🎯 Funcionalidades

- ✅ **Cálculo de Emissões** - Calcule emissões de CO² para diferentes modos de transporte
- ✅ **Comparação de Modos** - Compare emissões entre bicicleta, carro, ônibus e caminhão
- ✅ **Autocomplete de Cidades** - Sugestões automáticas de cidades brasileiras
- ✅ **Distância Automática** - Distância calculada automaticamente entre cidades cadastradas
- ✅ **Google Maps Distance Matrix API** - Suporte opcional a cálculo de distâncias para qualquer rota
- ✅ **Créditos de Carbono** - Estime créditos necessários e preço para compensar emissões
- ✅ **Interface Responsiva** - Funciona perfeitamente em desktop e mobile
- ✅ **Totalmente em Português** - Interface 100% localizada para português brasileiro
- ✅ **Animações Suaves** - Transições elegantes e feedback visual instantâneo

## 🚀 Demo

Acesse a aplicação ao vivo: [🔗 Link do Projeto](#)

## 📋 Requisitos

- Navegador moderno com suporte a ES6+ JavaScript
- Suporte a CSS Grid e Flexbox
- Suporte ao seletor CSS `:has()` (navegadores modernos)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/JMCVALE/CalculadoraCO2.git
cd CalculadoraCO2
```

2. Abra o arquivo `index.html` no navegador:
```bash
# No Windows
start index.html

# No macOS
open index.html

# No Linux
xdg-open index.html
```

Ou use um servidor local:
```bash
# Python 3
python -m http.server 8000

# Node.js com http-server
npx http-server
```

Acesse `http://localhost:8000` no navegador.

## 📁 Estrutura do Projeto

```
CO2_emission_calculator/
├── index.html              # Página HTML principal
├── css/
│   └── style.css          # Estilos da aplicação
├── js/
│   ├── app.js             # Inicialização e handlers
│   ├── calculator.js      # Lógica de cálculos
│   ├── config.js          # Configurações e setup
│   ├── routes-data.js     # Banco de dados de rotas
│   └── ui.js              # Componentes e renderização
└── README.md              # Este arquivo
```

## 🎨 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Design responsivo com Grid, Flexbox e Animações
- **JavaScript ES6+** - Lógica da aplicação
- **Git & GitHub** - Controle de versão

## 💡 Como Usar

### Passo 1: Preencher Origem e Destino
1. Digite a cidade de origem no campo "Origem"
2. Digite a cidade de destino no campo "Destino"
3. A distância será preenchida automaticamente se a rota existir

### Passo 2: Distância Manual (Opcional)
- Se a rota não existir na base de dados, ative a checkbox "Inserir distância manualmente"
- Digite a distância em quilômetros

### Passo 3: Selecionar Transporte
Clique em um dos ícones de transporte:
- 🚲 **Bicicleta** - 0 kg CO₂/km (zero emissão!)
- 🚗 **Carro** - 0.12 kg CO₂/km
- 🚌 **Ônibus** - 0.089 kg CO₂/km
- 🚚 **Caminhão** - 0.96 kg CO₂/km

### Passo 4: Calcular
Clique em "Calcular Emissão" e veja os resultados:
- Emissão total em kg de CO₂
- Comparação com outros modos de transporte
- Economia em relação ao carro
- Créditos de carbono necessários
- Faixa de preço para compensação

## 📊 Fatores de Emissão

Os fatores de emissão utilizados (kg CO₂ por km):

| Transporte | Emissão |
|-----------|---------|
| Bicicleta | 0.00    |
| Ônibus    | 0.089   |
| Carro     | 0.12    |
| Caminhão  | 0.96    |

**Fontes:** Baseado em dados médios de emissões para Brasil

## 💰 Créditos de Carbono

- **1 Crédito de Carbono = 1000 kg de CO₂**
- **Preço: R$ 50 a R$ 150 por crédito**

Use os créditos de carbono para compensar suas emissões através de projetos certificados de sustentabilidade.

## 🌍 Cidades Disponíveis

O banco de dados inclui as principais cidades brasileiras:

- **Região Sudeste**: São Paulo, Rio de Janeiro, Belo Horizonte
- **Região Nordeste**: Salvador, Fortaleza, Recife
- **Região Sul**: Curitiba, Porto Alegre
- **Região Centro-Oeste**: Brasília, Goiânia, Cuiabá
- **Região Norte**: Manaus, Belém

E mais de 30 rotas pré-cadastradas!

### 🚀 Expandir para Qualquer Rota com Google Maps API

Para calcular distâncias entre **qualquer par de cidades**, ative a Google Maps Distance Matrix API:

1. 📖 Siga o guia completo em [API_CONFIG.md](API_CONFIG.md)
2. Obtenha sua chave gratuita no [Google Cloud Console](https://console.cloud.google.com/)
3. Configure a chave no `index.html`
4. Pronto! Agora funciona para qualquer rota no Brasil e no mundo

**Sistema de Fallback Automático:**
- Primeiro busca em dados locais (rápido)
- Se não encontrar, tenta a API (qualquer rota)
- Se API não disponível, usa dados locais apenas

## 🔧 Configuração

As configurações estão no arquivo `js/config.js`:

```javascript
const CONFIG = {
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96,
  },
  
  TRANSPORT_MODES: {
    bicycle: { label: "Bicicleta", icon: "🚲", color: "#3b82f6" },
    // ... mais modos
  },
  
  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_USD: 50,
    PRICE_MAX_USD: 150,
  }
};
```

## 📱 Responsividade

A aplicação é totalmente responsiva e se adapta a:
- 📱 Celulares (320px+)
- 📱 Tablets (768px+)
- 🖥️ Desktops (1200px+)

## ♿ Acessibilidade

- ✅ Semântica HTML5 adequada
- ✅ Labels associadas aos inputs
- ✅ ARIA labels para seções
- ✅ Navegação por teclado
- ✅ Contraste de cores WCAG AA
- ✅ Textos descritivos

## 🎬 Funcionalidades Detalhadas

### Cálculo de Emissão
Fórmula utilizada:
```
Emissão (kg CO₂) = Distância (km) × Fator de Emissão (kg CO₂/km)
```

### Comparação de Modos
Cada modo é comparado com o carro como baseline:
```
Percentagem vs Carro = (Emissão do Modo / Emissão do Carro) × 100
```

### Economia
Calcula quanto você economiza usando um transporte mais sustentável:
```
Economia (kg) = Emissão do Carro - Emissão Escolhida
Percentagem de Economia = (Economia / Emissão do Carro) × 100
```

### Créditos de Carbono
Estima quantos créditos você precisa para compensar:
```
Créditos Necessários = Emissão Total (kg) / 1000
Preço Médio = Créditos × R$ 100 (média entre min e max)
```

## 🎨 Paleta de Cores

- **Verde Primário**: `#10b981` - Cor eco-friendly principal
- **Verde Secundário**: `#059669` - Hover e interações
- **Verde Claro**: `#34d399` - Destaques e acentos
- **Cinza Claro**: `#6b7280` - Textos secundários
- **Branco**: `#ffffff` - Fundo dos cards
- **Fundo**: Gradiente verde degradé

## 📈 Animações

- **fadeIn**: Aparecimento suave dos resultados (0.5s)
- **Transições**: Hover effects em botões e cards (0.3s)
- **Escalas**: Crescimento do ícone ao selecionar transporte

## 🐛 Conhecidos

- O seletor CSS `:has()` requer navegadores modernos (Chrome 105+, Firefox 121+, Safari 15.4+)
- As distâncias automáticas funcionam apenas com cidades cadastradas no `routes-data.js`

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Júlia Vale**
- GitHub: [@JMCVALE](https://github.com/JMCVALE)
- Projeto: [CalculadoraCO2](https://github.com/JMCVALE/CalculadoraCO2)

Desenvolvido com 💚 para [DIO](https://www.dio.me/) | Project GitHub Copilot

## 🙏 Agradecimentos

- DIO (Digital Innovation One) pela oportunidade
- GitHub Copilot pela assistência no desenvolvimento
- Comunidade open source

## 📧 Contato & Suporte

Para dúvidas, sugestões ou reportar bugs:
- 🐙 [Issues no GitHub](https://github.com/JMCVALE/CalculadoraCO2/issues)
- 📧 Email: [seu-email@email.com]

---

**Juntos pelo planeta!** 🌍♻️ Calcule, compare e compense suas emissões de carbono.

Última atualização: Janeiro 2026
