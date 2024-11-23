function showForm(model) {
    // Ocultar las tarjetas (modelos)
    document.getElementById('gridContainer').style.display = 'none';

    // Mostrar formulario y resultados
    document.getElementById('formContainer').style.display = 'block';

    // Resetear el formulario y resultados
    document.getElementById('queueForm').reset();
    document.getElementById('resultDisplay').innerHTML = ''; // Limpiar resultados previos
}

document.getElementById('queueForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const arrivalRate = parseFloat(document.getElementById('arrivalRate').value);
    const serviceRate = parseFloat(document.getElementById('serviceRate').value);

    // Nuevos campos nMin y nMax
    let nMin = parseInt(document.getElementById('nMin').value);
    const nMax = parseInt(document.getElementById('nMax').value);

    // Asegurarse de que nMin no sea menor a 0
    if (nMin < 0) {
        nMin = 0; // Establecer nMin a 0 si es menor que 0
    }

    // Mostrar mensaje de procesamiento antes de realizar los cálculos
    procesarInformacion();

    // Simular un retraso para mostrar los resultados tras el procesamiento (ejemplo: 2 segundos)
    setTimeout(() => {
        // Cálculo de métricas para el modelo M/M/1
        const result = calculateMM1(arrivalRate, serviceRate, nMin, nMax);
        displayResults(result);
    }, 2000); // Ajusta el tiempo según sea necesario
});

function calculateMM1(lambda, mu, nMin, nMax) {
    if (lambda >= mu) {
        return "El sistema no es estable (λ >= μ).";
    }

    // 1. Utilización (p)
    const p = lambda / mu;

    // 2. Probabilidad de que no haya clientes en el sistema (P0)
    const P0 = 1 - p;

    // 3. Número promedio de clientes en la fila (Lq)
    const Lq = (lambda ** 2) / (mu * (mu - lambda));

    // 4. Tiempo promedio de espera en la cola (Wq)
    const Wq = Lq / lambda;

    // 5. Tiempo promedio de espera en el sistema (W)
    const W = 1 / (mu - lambda);

    // 6. Número promedio de clientes en el sistema (L)
    const L = lambda / (mu - lambda);

    // 7. Probabilidad de que un cliente que llega tenga que esperar (Pw)
    const Pw = p;

    // 8. Probabilidad de que haya "n" clientes en el sistema (Pn) para cada valor entre nMin y nMax
    let PnResults = "";
    for (let n = nMin; n <= nMax; n++) {
        const Pn = Math.pow(p, n) * P0; // Probabilidad de exactamente n clientes en el sistema
        PnResults += `<p>P${n}: ${Pn.toFixed(4)}</p>`;
    }

    // Mostrar todos los resultados calculados
    return {
        "1. Utilización (p)": p.toFixed(4),
        "2. Probabilidad de que no haya clientes en el sistema (P0)": P0.toFixed(4),
        "3. Número promedio de clientes en la fila (Lq)": Lq.toFixed(4),
        "4. Tiempo promedio de espera en la cola (Wq)": Wq.toFixed(4),
        "5. Tiempo promedio de espera en el sistema (W)": W.toFixed(4),
        "6. Número promedio de clientes en el sistema (L)": L.toFixed(4),
        "7. Probabilidad de que un cliente que llega tenga que esperar (Pw)": Pw.toFixed(4),
        "8. Probabilidades Pn (para rango seleccionado)": PnResults,
    };
}

function displayResults(results) {
    const resultDisplay = document.getElementById('resultDisplay');
    resultDisplay.innerHTML = ''; // Limpiar resultados previos

    for (const metric in results) {
        const p = document.createElement('p');
        p.innerHTML = `${metric}: ${results[metric]}`; // Usar innerHTML para incluir etiquetas HTML
        resultDisplay.appendChild(p);
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

// Nueva función para reiniciar el formulario y volver a las tarjetas
function resetToModels() {
    // Mostrar las tarjetas (modelos)
    document.getElementById('gridContainer').style.display = 'block';

    // Ocultar formulario y resultados
    document.getElementById('formContainer').style.display = 'none';
}

// Botón para regresar al menú de modelos
document.getElementById('backToModels').addEventListener('click', resetToModels);
