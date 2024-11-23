function showForm(model) {
    // Ocultar las tarjetas (modelos)
    document.getElementById('gridContainer').style.display = 'none';

    // Mostrar formulario y resultados
    document.getElementById('formContainer').style.display = 'block';

    // Resetear el formulario y resultados
    document.getElementById('queueForm').reset();
    document.getElementById('resultDisplay').innerHTML = ''; // Limpiar resultados previos
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

document.getElementById('queueForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const arrivalRate = parseFloat(document.getElementById('arrivalRate').value);
    const serviceRate = parseFloat(document.getElementById('serviceRate').value);
    const servers = parseInt(document.getElementById('servers').value);

    // Nuevos campos nMin y nMax
    let nMin = parseInt(document.getElementById('nMin').value);
    const nMax = parseInt(document.getElementById('nMax').value);

    // Asegurarse de que nMin no sea menor a 0
    if (nMin < 0) {
        nMin = 0; // Establecer nMin a 0 si es menor que 0
    }

    // Mostrar mensaje de procesamiento mientras se calculan los resultados
    procesarInformacion();

    // Cálculo de métricas para el modelo M/M/c
    const result = calculateMMC(arrivalRate, serviceRate, servers, nMin, nMax);

    // Mostrar los resultados después del procesamiento
    setTimeout(() => {
        displayResults(result);
    }, 2000); // Asegurar que coincida con el tiempo del procesamiento simulado
});

function calculateMMC(lambda, mu, c, nMin, nMax) {
    const rho = lambda / (c * mu); // Factor de utilización para M/M/c
    if (rho >= 1) {
        return "El sistema no es estable (λ >= c * μ).";
    }

    // Probabilidad de que no haya clientes en el sistema (P0)
    let P0Sum = 0;
    for (let n = 0; n < c; n++) {
        P0Sum += Math.pow(lambda / mu, n) / factorial(n);
    }
    P0Sum += (Math.pow(lambda / mu, c) / (factorial(c) * (1 - rho)));
    const P0 = 1 / P0Sum;

    // Número promedio de clientes en la cola (Lq)
    const Lq = (Math.pow(lambda / mu, c) * rho * P0) / (factorial(c) * Math.pow(1 - rho, 2));

    // Número promedio de clientes en el sistema (L)
    const L = Lq + lambda / mu;

    // Tiempo promedio de espera en la cola (Wq)
    const Wq = Lq / lambda;

    // Tiempo promedio de espera en el sistema (W)
    const W = Wq + 1 / mu;

    // Probabilidad de que un cliente que llega tenga que esperar (Pw)
    const Pw = (Math.pow(lambda / mu, c) * rho * P0) / (factorial(c) * (1 - rho));

    // Probabilidad de que haya "n" clientes en el sistema (Pn) para cada valor entre nMin y nMax
    let PnResults = "";
    for (let n = nMin; n <= nMax; n++) {
        let Pn;
        if (n < c) {
            Pn = (Math.pow(lambda / mu, n) / factorial(n)) * P0;
        } else {
            Pn = (Math.pow(lambda / mu, n) / (factorial(c) * Math.pow(c, n - c))) * P0;
        }
        PnResults += `<p>P${n}: ${Pn.toFixed(4)}</p>`;
    }

    // Mostrar todos los resultados calculados
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
    resultDisplay.innerHTML = ''; // Limpiar resultados previos

    // Verificar si los resultados contienen un mensaje de error
    if (typeof results === 'string') {
        resultDisplay.innerHTML = results;
    } else {
        // Mostrar cada resultado en un nuevo párrafo
        for (const metric in results) {
            const p = document.createElement('p');
            p.innerHTML = `${metric}: ${results[metric]}`; // Usar innerHTML para incluir etiquetas HTML
            resultDisplay.appendChild(p);
        }
    }
}
