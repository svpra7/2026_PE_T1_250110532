document.addEventListener('DOMContentLoaded', () => {

    Chart.defaults.color = '#bbb';
    Chart.defaults.borderColor = '#333';
    Chart.defaults.font.family = 'Segoe UI';

    initDiscretos();
    initContinuos();
    initCualitativos();
});

function initDiscretos() {
    const N = 100;
    let datos = [];

    for(let i=0; i<N; i++) {
        let r = Math.random();
        if(r<0.35) datos.push(0); else if(r<0.65) datos.push(1);
        else if(r<0.85) datos.push(2); else if(r<0.95) datos.push(3);
        else datos.push(4);
    }
    datos.sort((a,b)=>a-b);

    const sum = datos.reduce((a,b)=>a+b,0);
    document.getElementById('disc-promedio').textContent = (sum/N).toFixed(2);

    const counts = {};
    [0,1,2,3,4].forEach(k => counts[k] = 0);
    datos.forEach(x => counts[x] = (counts[x]||0)+1);

    const tbody = document.querySelector('#tabla-discretos tbody');
    let labels = [], dataF = [], dataAcum = [], acumulada = 0;

    for(let k in counts) {
        let f = counts[k];
        acumulada += f;
        let fr = (f/N).toFixed(2);
        let porc = ((f/N)*100).toFixed(0);
        
        labels.push(k);
        dataF.push(f);
        dataAcum.push(acumulada);

        tbody.innerHTML += `<tr><td>${k}</td><td>${f}</td><td>${fr}</td><td>${porc}%</td><td>${acumulada}</td></tr>`;
    }

    const colorsRed = ['#ff8a80', '#ff5252', '#ff1744', '#d50000', '#b71c1c'];

    new Chart(document.getElementById('d1_barras'), {
        type: 'bar',
        data: { labels: labels, datasets: [{ label: 'Frecuencia', data: dataF, backgroundColor: '#d50000' }] },
        options: { plugins: { title: { display: true, text: 'Diagrama de Barras' }, legend: {display:false} } }
    });

    new Chart(document.getElementById('d2_pastel'), {
        type: 'pie',
        data: { labels: labels, datasets: [{ data: dataF, backgroundColor: colorsRed }] },
        options: { plugins: { title: { display: true, text: 'Distribución Porcentual' } } }
    });

    new Chart(document.getElementById('d3_poligono'), {
        type: 'line',
        data: { labels: labels, datasets: [{ label: 'Polígono', data: dataF, borderColor: '#ff1744', tension: 0, pointStyle: 'circle', pointRadius: 6 }] },
        options: { plugins: { title: { display: true, text: 'Polígono de Frecuencias' }, legend: {display:false} } }
    });

    new Chart(document.getElementById('d4_ojiva'), {
        type: 'line',
        data: { labels: labels, datasets: [{ label: 'Acumulada', data: dataAcum, borderColor: '#fff', borderDash: [5,5], fill: true, backgroundColor: 'rgba(213,0,0,0.2)' }] },
        options: { plugins: { title: { display: true, text: 'Ojiva (Menor que)' }, legend: {display:false} } }
    });

    new Chart(document.getElementById('d5_horizontal'), {
        type: 'bar',
        data: { labels: labels, datasets: [{ label: 'Frecuencia', data: dataF, backgroundColor: '#b71c1c' }] },
        options: { indexAxis: 'y', plugins: { title: { display: true, text: 'Barras Horizontales' }, legend: {display:false} } }
    });
}

function initContinuos() {
    const N = 100;
    let datos = [];
    for(let i=0; i<N; i++) datos.push(parseFloat((Math.random()*50 + 10).toFixed(2)));
    
    const min = Math.min(...datos);
    const max = Math.max(...datos);
    document.getElementById('cont-minmax').textContent = `${Math.floor(min)} - ${Math.ceil(max)}`;
    document.getElementById('cont-promedio').textContent = (datos.reduce((a,b)=>a+b,0)/N).toFixed(2);

    const K = 6; 
    const A = Math.ceil((max-min)/K);
    let inicio = Math.floor(min);
    
    let labels = [], marks = [], dataF = [], dataAcum = [], acumulada = 0;
    const tbody = document.querySelector('#tabla-continuos tbody');

    for(let i=0; i<K; i++) {
        let li = inicio + i*A;
        let ls = li + A;
        let marca = (li+ls)/2;
        let f = datos.filter(x => x >= li && x < ls).length;
        if(i === K-1) f += datos.filter(x => x === ls).length;
        
        acumulada += f;
        labels.push(`[${li}-${ls})`);
        marks.push(marca.toFixed(1));
        dataF.push(f);
        dataAcum.push(acumulada);

        tbody.innerHTML += `<tr><td>[${li} - ${ls})</td><td>${marca.toFixed(1)}</td><td>${f}</td><td>${f}%</td><td>${acumulada}</td></tr>`;
    }

    new Chart(document.getElementById('c1_histograma'), {
        type: 'bar',
        data: { labels: marks, datasets: [{ label: 'Frecuencia', data: dataF, backgroundColor: '#d50000', barPercentage: 1.0, categoryPercentage: 1.0, borderColor: 'black', borderWidth: 1 }] },
        options: { plugins: { title: { display: true, text: 'Histograma' }, legend: {display:false} } }
    });

    new Chart(document.getElementById('c2_poligono'), {
        type: 'line',
        data: { labels: marks, datasets: [{ label: 'Frecuencia', data: dataF, borderColor: '#ff5252', backgroundColor: 'rgba(255,82,82,0.2)', fill: true, tension: 0.3 }] },
        options: { plugins: { title: { display: true, text: 'Polígono Suavizado' }, legend: {display:false} } }
    });

    new Chart(document.getElementById('c3_ojiva'), {
        type: 'line',
        data: { labels: labels, datasets: [{ label: 'Acumulada', data: dataAcum, borderColor: '#fff', pointStyle: 'rect', pointRadius: 5 }] },
        options: { plugins: { title: { display: true, text: 'Ojiva Acumulada' }, legend: {display:false} } }
    });

    new Chart(document.getElementById('c4_area'), {
        type: 'line',
        data: { labels: marks, datasets: [{ label: 'Volumen', data: dataF, borderColor: '#b71c1c', fill: true, backgroundColor: '#b71c1c' }] },
        options: { plugins: { title: { display: true, text: 'Gráfica de Área' }, legend: {display:false} }, elements: { point: { radius: 0 } } }
    });

    new Chart(document.getElementById('c5_pastel'), {
        type: 'pie',
        data: { labels: labels, datasets: [{ data: dataF, backgroundColor: ['#333', '#555', '#777', '#999', '#bbb', '#ddd'] }] },
        options: { plugins: { title: { display: true, text: 'Distribución por Intervalos' } } }
    });
}

function initCualitativos() {
    const labels = ['Café Central', 'Kiosko', 'Vending', 'Lunch Propio', 'Ayuno'];
    const data = [35, 25, 15, 20, 5]; 

    const tbody = document.querySelector('#tabla-cualitativos tbody');
    labels.forEach((l, i) => {
        tbody.innerHTML += `<tr><td>${l}</td><td>${data[i]}</td><td>${data[i]}%</td></tr>`;
    });

    const colorsMix = ['#b71c1c', '#d50000', '#ff1744', '#ff5252', '#ff8a80'];

    new Chart(document.getElementById('q1_barras'), {
        type: 'bar',
        data: { labels: labels, datasets: [{ data: data, backgroundColor: colorsMix }] },
        options: { plugins: { title: { display: true, text: 'Preferencias (Barras)' }, legend: {display:false} } }
    });


    new Chart(document.getElementById('q2_pastel'), {
        type: 'pie',
        data: { labels: labels, datasets: [{ data: data, backgroundColor: colorsMix }] },
        options: { plugins: { title: { display: true, text: 'Preferencias (Pastel)' } } }
    });

    new Chart(document.getElementById('q3_dona'), {
        type: 'doughnut',
        data: { labels: labels, datasets: [{ data: data, backgroundColor: colorsMix, borderColor: '#000' }] },
        options: { plugins: { title: { display: true, text: 'Gráfica de Dona' } } }
    });

    new Chart(document.getElementById('q4_polar'), {
        type: 'polarArea',
        data: { labels: labels, datasets: [{ data: data, backgroundColor: colorsMix }] },
        options: { plugins: { title: { display: true, text: 'Área Polar' } }, scales: { r: { grid: { color: '#333' } } } }
    });

    new Chart(document.getElementById('q5_horizontal'), {
        type: 'bar',
        data: { labels: labels, datasets: [{ data: data, backgroundColor: '#d50000' }] },
        options: { indexAxis: 'y', plugins: { title: { display: true, text: 'Comparativa Horizontal' }, legend: {display:false} } }
    });
}