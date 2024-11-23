document.getElementById('queueForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const arrivalRate = parseFloat(document.getElementById('arrivalRate').value);
    const serviceRate = parseFloat(document.getElementById('serviceRate').value);
    const servers = parseInt(document.getElementById('servers').value);
    const capacity = parseInt(document.getElementById('capacity').value);

    let nMin = parseInt(document.getElementById('nMin').value);
    const nMax = parseInt(document.getElementById('nMax').value);

    if (nMin < 0) {
        nMin = 0;
    }

    // Mostrar mensaje de procesamiento antes de realizar los cálculos
    procesarInformacion();

    // Simular un retraso para mostrar los resultados tras el procesamiento (ejemplo: 2 segundos)
    setTimeout(() => {
        const result = calculateMMCK(arrivalRate, serviceRate, servers, capacity, nMin, nMax);
        displayResults(result);
    }, 2000); // Ajusta el tiempo según sea necesario
});

function calculateMMCK(lambda, mu, c, K, nMin, nMax) {
    const rho = lambda / (c * mu);
    
    if (rho >= 1) {
        return "El sistema no es estable (λ >= c * μ).";
    }

    // Probabilidad de que no haya clientes en el sistema (P0)
    let P0Sum = 0;
    for (let n = 0; n < c; n++) {
        P0Sum += Math.pow(lambda / mu, n) / factorial(n);
    }
    P0Sum += (Math.pow(lambda / mu, c) * (1 - Math.pow(rho, K - c + 1))) / (factorial(c) * (1 - rho));
    const P0 = 1 / P0Sum;

    // Lq (Número promedio de clientes en la cola)
    const Lq = (P0 * Math.pow(lambda / mu, c) * rho * (1 - Math.pow(rho, K - c) - (K - c) * Math.pow(rho, K - c) * (1 - rho))) / (factorial(c) * Math.pow(1 - rho, 2));

    // P_K (Probabilidad de que el sistema esté en su capacidad máxima)
    const PK = (Math.pow(lambda / mu, K) / (factorial(c) * Math.pow(c, K - c))) * P0;

    // L (Número promedio de clientes en el sistema)
    const L = Lq + lambda / mu;

    // Wq (Tiempo promedio de espera en la cola)
    const Wq = Lq / (lambda * (1 - PK));

    // W (Tiempo promedio de espera en el sistema)
    const W = L / (lambda * (1 - PK));

    // Pw (Probabilidad de que un cliente que llega tenga que esperar)
    let PwSum = 0;
    for (let n = 0; n < c; n++) {
        PwSum += Math.pow(lambda / mu, n) / factorial(n);
    }
    const Pw = 1 - (P0 * PwSum);

    // Probabilidades de que haya "n" clientes en el sistema (Pn) para cada valor entre nMin y nMax
    let PnResults = "";
    for (let n = nMin; n <= nMax && n <= K; n++) {
        let Pn;
        if (n < c) {
            Pn = (Math.pow(lambda / mu, n) / factorial(n)) * P0;
        } else if (n <= K) {
            Pn = (Math.pow(lambda / mu, n) / (factorial(c) * Math.pow(c, n - c))) * P0;
        } else {
            Pn = 0;
        }
        PnResults += `<p>P${n}: ${Pn.toFixed(4)}</p>`;
    }

    return {
        "1. Utilización (ρ)": rho.toFixed(4),
        "2. Probabilidad de que no haya clientes en el sistema (P0)": P0.toFixed(4),
        "3. Número promedio de clientes en la fila (Lq)": Lq.toFixed(4),
        "4. Tiempo promedio de espera en la cola (Wq)": Wq.toFixed(4),
        "5. Tiempo promedio de espera en el sistema (W)": W.toFixed(4),
        "6. Número promedio de clientes en el sistema (L)": L.toFixed(4),
        "7. Probabilidad de que un cliente que llega tenga que esperar (Pw)": Pw.toFixed(4),
        "8. Probabilidades Pn (para rango seleccionado)": PnResults,
    };
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function displayResults(results) {
    const resultDisplay = document.getElementById('resultDisplay');
    resultDisplay.innerHTML = '';  // Limpiar resultados previos

    if (typeof results === 'string') {
        resultDisplay.innerHTML = results;
    } else {
        for (const metric in results) {
            const p = document.createElement('p');
            p.innerHTML = `${metric}: ${results[metric]}`;
            resultDisplay.appendChild(p);
        }
    }
}

// Nueva función: procesar información
function procesarInformacion() {
    const resultDisplay = document.getElementById('resultDisplay');

    // Mostrar mensaje de procesamiento
    resultDisplay.innerHTML = '<p>Procesando información...</p>';

    // Simula un retraso antes de mostrar los cálculos (ejemplo: 2 segundos)
    setTimeout(() => {
        resultDisplay.innerHTML = '<p>Información procesada con éxito.</p>';
    }, 2000); // Ajusta el tiempo según sea necesario
}
