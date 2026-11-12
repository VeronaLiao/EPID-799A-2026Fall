const form = document.getElementById('sir-form');
const errorMessage = document.getElementById('error-message');
const summaryR0 = document.getElementById('summary-r0');
const summaryPeak = document.getElementById('summary-peak');
const summaryDay = document.getElementById('summary-day');
const summaryFinalRecovered = document.getElementById('summary-final-recovered');
const chartContext = document.getElementById('sir-chart').getContext('2d');

let sirChart;

function getInputs() {
  return {
    population: Number(document.getElementById('population').value),
    infected0: Number(document.getElementById('infected0').value),
    recovered0: Number(document.getElementById('recovered0').value),
    beta: Number(document.getElementById('beta').value),
    gamma: Number(document.getElementById('gamma').value),
    days: Number(document.getElementById('days').value)
  };
}

function validateInputs({ population, infected0, recovered0, beta, gamma, days }) {
  if ([population, infected0, recovered0, beta, gamma, days].some((value) => Number.isNaN(value))) {
    return 'All inputs must be valid numbers.';
  }

  if (population <= 0) {
    return 'Population must be greater than 0.';
  }

  if (infected0 < 0 || recovered0 < 0) {
    return 'Initial infected and recovered values cannot be negative.';
  }

  if (infected0 + recovered0 > population) {
    return 'Initial infected plus recovered cannot exceed the population.';
  }

  if (beta < 0 || gamma < 0) {
    return 'Beta and gamma must be non-negative.';
  }

  if (days < 1) {
    return 'Days must be at least 1.';
  }

  return null;
}

function simulateSIR({ population, infected0, recovered0, beta, gamma, days }) {
  const susceptible0 = population - infected0 - recovered0;
  const dt = 1;

  const time = [0];
  const susceptible = [susceptible0];
  const infected = [infected0];
  const recovered = [recovered0];

  for (let day = 1; day <= days; day += 1) {
    const sPrev = susceptible[day - 1];
    const iPrev = infected[day - 1];
    const rPrev = recovered[day - 1];

    const newInfections = (beta * sPrev * iPrev / population) * dt;
    const newRecoveries = gamma * iPrev * dt;

    const sNext = Math.max(0, sPrev - newInfections);
    const iNext = Math.max(0, iPrev + newInfections - newRecoveries);
    const rNext = Math.max(0, rPrev + newRecoveries);

    time.push(day);
    susceptible.push(sNext);
    infected.push(iNext);
    recovered.push(rNext);
  }

  return { time, susceptible, infected, recovered };
}

function calculateSummary(results, beta, gamma) {
  const peakValue = Math.max(...results.infected);
  const peakDay = results.infected.indexOf(peakValue);
  const finalRecovered = results.recovered[results.recovered.length - 1];
  const basicReproductionNumber = gamma === 0 ? 'Infinity' : (beta / gamma).toFixed(2);

  return {
    basicReproductionNumber,
    peakValue: peakValue.toFixed(2),
    peakDay,
    finalRecovered: finalRecovered.toFixed(2)
  };
}

function renderSummary(summary) {
  summaryR0.textContent = summary.basicReproductionNumber;
  summaryPeak.textContent = summary.peakValue;
  summaryDay.textContent = summary.peakDay;
  summaryFinalRecovered.textContent = summary.finalRecovered;
}

function renderChart(results) {
  if (sirChart) {
    sirChart.destroy();
  }

  sirChart = new Chart(chartContext, {
    type: 'line',
    data: {
      labels: results.time,
      datasets: [
        {
          label: 'Susceptible',
          data: results.susceptible,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.15)',
          tension: 0.25,
          pointRadius: 0
        },
        {
          label: 'Infected',
          data: results.infected,
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.15)',
          tension: 0.25,
          pointRadius: 0
        },
        {
          label: 'Recovered',
          data: results.recovered,
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22, 163, 74, 0.15)',
          tension: 0.25,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Day'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Number of People'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  });
}

function runSimulation() {
  const inputs = getInputs();
  const validationError = validateInputs(inputs);

  if (validationError) {
    errorMessage.textContent = validationError;
    return;
  }

  errorMessage.textContent = '';
  const results = simulateSIR(inputs);
  const summary = calculateSummary(results, inputs.beta, inputs.gamma);

  renderSummary(summary);
  renderChart(results);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  runSimulation();
});

runSimulation();
