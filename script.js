document.addEventListener('DOMContentLoaded', () => {
    // Configuración básica de colores (Chart.js)
    Chart.defaults.color = '#ccc';
    Chart.defaults.borderColor = '#444';

    // Color morado plano para las barras
    const colorBarra = '#9D4EDD'; 
    // Colores distintos para el pastel
    const coloresPastel = ['#9D4EDD', '#7B2CBF', '#5A189A', '#C77DFF'];

    initDiscretos(colorBarra);
    initContinuos(colorBarra);
    initCualitativos(coloresPastel);
});

// 1. DISCRETOS (Materias)
function initDiscretos(color) {
    const N = 100;
    let datos = [];
    // Generar datos aleatorios
    for (let i = 0; i < N; i++) {
        const rand = Math.random();
        if (rand < 0.35) datos.push(0);
        else if (rand < 0.65) datos.push(1);
        else if (rand < 0.85) datos.push(2);
        else if (rand < 0.95) datos.push(3);
        else datos.push(4);
    }
    datos.sort((a, b) => a - b);

    // Cálculos simples
    const sum = datos.reduce((a, b) => a + b, 0);
    const promedio = (sum / N).toFixed(2);
    document.getElementById('disc-promedio').textContent = promedio;

    // Tabla y Gráfica
    const frecuencias = {};
    datos.forEach(d => frecuencias[d] = (frecuencias[d] || 0) + 1);

    const tabla = document.querySelector('#tabla-discretos tbody');
    const labels = [], data = [];

    for (let xi = 0; xi <= 4; xi++) { // Sabemos que va de 0 a 4
        if (frecuencias[xi]) {
            const fi = frecuencias[xi];
            const porc = ((fi/N)*100).toFixed(0) + '%';
            labels.push(xi);
            data.push(fi);
            tabla.innerHTML += `<tr><td>${xi}</td><td>${fi}</td><td>${porc}</td></tr>`;
        }
    }

    // Gráfica simple
    new Chart(document.getElementById('graficoDiscretos'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Estudiantes',
                data: data,
                backgroundColor: color
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// 2. CONTINUOS (Tiempo)
function initContinuos(color) {
    const N = 100;
    let datos = [];
    for (let i = 0; i < N; i++) {
        datos.push(parseFloat(((Math.random() * 40) + 10).toFixed(2))); // Entre 10 y 50 mins
    }
    
    const min = Math.min(...datos);
    const max = Math.max(...datos);
    const prom = (datos.reduce((a,b)=>a+b,0) / N).toFixed(2);

    document.getElementById('cont-minmax').textContent = `${Math.floor(min)} - ${Math.ceil(max)}`;
    document.getElementById('cont-promedio').textContent = prom;

    // Agrupar en 6 intervalos simples
    const clases = 6;
    const ancho = Math.ceil((max - min) / clases);
    const tabla = document.querySelector('#tabla-continuos tbody');
    const labels = [], data = [];
    let inicio = Math.floor(min);

    for(let i=0; i<clases; i++){
        let limInf = inicio + (i * ancho);
        let limSup = limInf + ancho;
        let marca = (limInf + limSup) / 2;
        let fi = datos.filter(d => d >= limInf && d < limSup).length;
        
        // Ajuste para el último intervalo (incluir límite superior)
        if(i === clases-1) fi += datos.filter(d => d === limSup).length;

        labels.push(marca.toFixed(0));
        data.push(fi);
        tabla.innerHTML += `<tr><td>[${limInf} - ${limSup})</td><td>${marca}</td><td>${fi}</td><td>${fi}%</td></tr>`;
    }

    new Chart(document.getElementById('graficoContinuos'), {
        type: 'bar', // Histograma visual
        data: {
            labels: labels,
            datasets: [{
                label: 'Frecuencia',
                data: data,
                backgroundColor: color,
                barPercentage: 1.0, // Pegadas como histograma
                categoryPercentage: 1.0,
                borderWidth: 1,
                borderColor: '#222'
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// 3. CUALITATIVOS (Cafetería)
function initCualitativos(colores) {
    const labels = ['Café Central', 'Kiosko', 'Biblioteca', 'Máquinas'];
    const data = [45, 25, 20, 10]; // Datos fijos para ejemplo simple
    
    const tabla = document.querySelector('#tabla-cualitativos tbody');
    labels.forEach((cat, i) => {
        tabla.innerHTML += `<tr><td>${cat}</td><td>${data[i]}</td><td>${data[i]}%</td></tr>`;
    });

    new Chart(document.getElementById('graficoCualitativos'), {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colores
            }]
        }
    });
}