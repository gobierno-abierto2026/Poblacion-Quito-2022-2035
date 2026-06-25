// Global Variables
let currentParroquia = 'ALL';
let currentYear = 2025; // Default reference year

let evolutionChartInstance = null;
let genderChartInstance = null;

// Format numbers
const formatNumber = (num) => {
    return new Intl.NumberFormat('es-EC').format(num);
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    if (typeof dmqData === 'undefined') {
        console.error("Data not loaded. Make sure data.js is included.");
        return;
    }
    
    initFilters();
    updateDashboard();
    
    // Event Listeners
    document.getElementById('parroquia-select').addEventListener('change', (e) => {
        currentParroquia = e.target.value;
        updateDashboard();
    });
    
    document.getElementById('year-select').addEventListener('change', (e) => {
        currentYear = parseInt(e.target.value);
        updateDashboard();
    });
    
    document.getElementById('reset-filters').addEventListener('click', () => {
        document.getElementById('parroquia-select').value = 'ALL';
        document.getElementById('year-select').value = '2025';
        currentParroquia = 'ALL';
        currentYear = 2025;
        updateDashboard();
    });
});

function initFilters() {
    // Populate Parroquias
    const parroquiaSelect = document.getElementById('parroquia-select');
    dmqData.parroquias.forEach(p => {
        const option = document.createElement('option');
        option.value = p;
        option.textContent = p;
        parroquiaSelect.appendChild(option);
    });
    
    // Populate Years
    const yearSelect = document.getElementById('year-select');
    const years = [...new Set(dmqData.registros.map(r => r.anio))].sort((a, b) => a - b);
    
    years.forEach(y => {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        if (y === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    });
}

function updateDashboard() {
    // Filter data based on selections
    let filteredRecords = dmqData.registros;
    
    if (currentParroquia !== 'ALL') {
        filteredRecords = filteredRecords.filter(r => r.nombre_parroquia === currentParroquia);
        document.getElementById('current-scope').textContent = currentParroquia;
    } else {
        document.getElementById('current-scope').textContent = "Todo el DMQ";
    }
    
    // Update KPIs
    updateKPIs(filteredRecords);
    
    // Update Charts
    updateEvolutionChart(filteredRecords);
    updateGenderChart(filteredRecords);
    
    // Update Table
    updateTable(filteredRecords);
}

function updateKPIs(records) {
    // Get population for current year
    const currentYearRecords = records.filter(r => r.anio === currentYear);
    const popCurrent = currentYearRecords.reduce((sum, r) => sum + r.poblacion_total, 0);
    
    // Get population for 2035
    const futureRecords = records.filter(r => r.anio === 2035);
    const popFuture = futureRecords.reduce((sum, r) => sum + r.poblacion_total, 0);
    
    // Growth
    let growth = 0;
    if (popCurrent > 0) {
        growth = ((popFuture - popCurrent) / popCurrent) * 100;
    }
    
    document.getElementById('kpi-pop-current').textContent = formatNumber(popCurrent);
    document.getElementById('kpi-pop-year').textContent = `Año: ${currentYear}`;
    document.getElementById('kpi-pop-2035').textContent = formatNumber(popFuture);
    
    const growthEl = document.getElementById('kpi-growth');
    growthEl.textContent = `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
    growthEl.style.color = growth >= 0 ? 'var(--emerald)' : 'var(--amber)';
}

function updateEvolutionChart(records) {
    // Group by year
    const groupedByYear = records.reduce((acc, r) => {
        if (!acc[r.anio]) {
            acc[r.anio] = { total: 0, historico: r.tipo === 'Historico' };
        }
        acc[r.anio].total += r.poblacion_total;
        return acc;
    }, {});
    
    const years = Object.keys(groupedByYear).map(Number).sort((a, b) => a - b);
    
    const histData = years.map(y => groupedByYear[y].historico ? groupedByYear[y].total : null);
    const proyData = years.map(y => !groupedByYear[y].historico ? groupedByYear[y].total : null);
    
    // Connect the line between historical and projected by duplicating the last historical point into projected
    const lastHistIndex = years.findLastIndex(y => groupedByYear[y].historico);
    if (lastHistIndex !== -1 && lastHistIndex < years.length - 1) {
        proyData[lastHistIndex] = histData[lastHistIndex];
    }

    const ctx = document.getElementById('evolutionChart').getContext('2d');
    
    if (evolutionChartInstance) {
        evolutionChartInstance.destroy();
    }
    
    evolutionChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Histórico (Censos)',
                    data: histData,
                    borderColor: '#1e293b',
                    backgroundColor: '#1e293b',
                    tension: 0.3,
                    borderWidth: 3,
                    pointRadius: 4,
                    spanGaps: true
                },
                {
                    label: 'Proyección',
                    data: proyData,
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f6',
                    borderDash: [5, 5],
                    tension: 0.3,
                    borderWidth: 3,
                    pointRadius: 4,
                    spanGaps: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatNumber(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value >= 1000000 ? (value / 1000000).toFixed(1) + 'M' : 
                                   value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value;
                        }
                    }
                }
            }
        }
    });
}

function updateGenderChart(records) {
    const currentYearRecords = records.filter(r => r.anio === currentYear);
    
    const hombres = currentYearRecords.reduce((sum, r) => sum + r.hombres, 0);
    const mujeres = currentYearRecords.reduce((sum, r) => sum + r.mujeres, 0);
    
    const ctx = document.getElementById('genderChart').getContext('2d');
    
    if (genderChartInstance) {
        genderChartInstance.destroy();
    }
    
    genderChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Hombres', 'Mujeres'],
            datasets: [{
                data: [hombres, mujeres],
                backgroundColor: ['#3b82f6', '#ec4899'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = ((context.raw / total) * 100).toFixed(1);
                            return ` ${context.label}: ${formatNumber(context.raw)} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });
}

function updateTable(records) {
    const tbody = document.querySelector('#data-table tbody');
    tbody.innerHTML = '';
    
    // Group records by year for the table
    const groupedByYear = records.reduce((acc, r) => {
        if (!acc[r.anio]) {
            acc[r.anio] = { 
                anio: r.anio, 
                tipo: r.tipo, 
                poblacion_total: 0, 
                hombres: 0, 
                mujeres: 0 
            };
        }
        acc[r.anio].poblacion_total += r.poblacion_total;
        acc[r.anio].hombres += r.hombres;
        acc[r.anio].mujeres += r.mujeres;
        return acc;
    }, {});
    
    const years = Object.keys(groupedByYear).map(Number).sort((a, b) => a - b); // Ascending
    
    // Show only the last 15 entries for brevity or all if filtered by parroquia
    const displayYears = years; 
    
    displayYears.forEach(y => {
        const row = groupedByYear[y];
        const tr = document.createElement('tr');
        
        const badgeClass = row.tipo === 'Historico' ? 'tipo-historico' : 'tipo-proyectado';
        
        tr.innerHTML = `
            <td><strong>${row.anio}</strong></td>
            <td><span class="badge-tipo ${badgeClass}">${row.tipo}</span></td>
            <td><strong>${formatNumber(row.poblacion_total)}</strong></td>
            <td>${formatNumber(row.hombres)}</td>
            <td>${formatNumber(row.mujeres)}</td>
        `;
        tbody.appendChild(tr);
    });
}
