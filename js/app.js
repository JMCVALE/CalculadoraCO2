// app.js - Inicialização da aplicação
// Preenche datalist e configura preenchimento automático de distância quando DOM está pronto

document.addEventListener('DOMContentLoaded', function() {
  try {
    if (typeof CONFIG !== 'undefined' && CONFIG.populateDetails) {
      CONFIG.populateDetails();
    }

    if (typeof CONFIG !== 'undefined' && CONFIG.setupDistanceAutofill) {
      CONFIG.setupDistanceAutofill();
    }

    // Configurar feedback visual para seleção de transporte
    setupTransportVisualFeedback();

    // Configurar handler de envio do formulário
    setupFormSubmitHandler();
  } catch (err) {
    console.error('Erro durante inicialização da aplicação:', err);
  }
});

/**
 * Adiciona feedback visual melhorado quando um transporte é selecionado
 */
function setupTransportVisualFeedback() {
  const transportInputs = document.querySelectorAll('input[name="transport"]');
  const transportItems = document.querySelectorAll('.calculator__transport-item');

  transportInputs.forEach((input) => {
    input.addEventListener('change', function() {
      // Remover classe ativa de todos
      transportItems.forEach((item) => {
        item.classList.remove('transport-selected');
      });

      // Adicionar classe ativa ao selecionado
      if (this.checked) {
        const label = this.closest('.calculator__transport-item');
        if (label) {
          label.classList.add('transport-selected');
        }
      }
    });
  });

  // Inicializar estado visual para o radio pré-selecionado
  const checkedInput = document.querySelector('input[name="transport"]:checked');
  if (checkedInput) {
    const label = checkedInput.closest('.calculator__transport-item');
    if (label) {
      label.classList.add('transport-selected');
    }
  }
}

/**
 * Configura o handler para envio do formulário
 * Captura dados de origem, destino, distância e modo de transporte
 * Calcula emissões e exibe resultados
 */
function setupFormSubmitHandler() {
  const form = document.getElementById('calculator-form');
  if (!form) {
    console.error('Formulário não encontrado');
    return;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    try {
      // Obter valores do formulário
      const origin = document.getElementById('origin').value.trim();
      const destination = document.getElementById('destination').value.trim();
      const distanceInput = document.getElementById('distance');
      const distance = distanceInput ? Number(distanceInput.value) : 0;

      // Obter modo de transporte selecionado
      const transportRadios = document.querySelectorAll('input[name="transport"]');
      let selectedTransport = null;
      transportRadios.forEach((radio) => {
        if (radio.checked) {
          selectedTransport = radio.value;
        }
      });

      // Validar entrada
      if (!origin || !destination) {
        alert('Por favor, preencheu origem e destino');
        return;
      }

      if (distance <= 0) {
        alert('Por favor, insira uma distância válida');
        return;
      }

      if (!selectedTransport) {
        alert('Por favor, selecione um modo de transporte');
        return;
      }

      // Mostrar loading
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn && UI && UI.showLoading) {
        UI.showLoading(submitBtn);
      }

      // Simular delay de processamento
      setTimeout(function() {
        try {
          // Calcular emissão para modo selecionado
          const emission = Calculator.calculateEmission(distance, selectedTransport);

          // Calcular emissão de carro como baseline
          const carEmission = Calculator.calculateEmission(distance, 'car');

          // Calcular economia
          const savings = Calculator.calculateSavings(emission, carEmission);

          // Calcular créditos de carbono
          const credits = Calculator.calculateCarbonCredits(emission);
          const creditPrice = Calculator.estimatedCreditPrice(credits);

          // Obter todos os modos para comparação
          const allModes = Calculator.calculateAllModes(distance);

          // Preparar dados para renderização
          const resultsData = {
            origin: origin,
            destination: destination,
            distance: distance,
            emission: emission,
            mode: selectedTransport,
            savings: savings
          };

          const creditsData = {
            credits: credits,
            price: creditPrice
          };

          // Renderizar resultados
          if (UI) {
            const resultsContent = document.getElementById('result-content');
            const comparisonContent = document.getElementById('comparison-content');
            const creditsContent = document.getElementById('carbon-credits-content');

            if (resultsContent) {
              resultsContent.innerHTML = UI.renderResults(resultsData);
              UI.showElement('results');
            }

            if (comparisonContent) {
              comparisonContent.innerHTML = UI.renderComparison(allModes, selectedTransport);
              UI.showElement('comparison');
            }

            if (creditsContent) {
              creditsContent.innerHTML = UI.renderCarbonCredits(creditsData);
              UI.showElement('carbon-credits');
            }

            // Rolar para os resultados
            if (UI.scrollToElement) {
              UI.scrollToElement('results');
            }
          }
        } catch (err) {
          console.error('Erro ao processar cálculo:', err);
          alert('Ocorreu um erro ao processar o cálculo. Tente novamente.');
        } finally {
          // Remover loading
          if (submitBtn && UI && UI.hideLoading) {
            UI.hideLoading(submitBtn);
          }
        }
      }, 500);
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      alert('Erro ao processar sua solicitação');
    }
  });
}
