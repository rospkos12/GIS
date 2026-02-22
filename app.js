async function init() {
  const [stateGeo, rainfallData] = await Promise.all([
    fetch('TN_Boundary.geojson').then((r) => r.json()),
    fetch('data/rainfall_tn_2005_2024.json').then((r) => r.json())
  ]);

  const years = rainfallData.years;
  const districts = rainfallData.districts;

  const map = L.map('map').setView([10.8, 78.7], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.geoJSON(stateGeo, {
    style: {
      color: '#1e40af',
      weight: 2,
      fillColor: '#bfdbfe',
      fillOpacity: 0.25
    }
  }).addTo(map);

  const yearRange = document.getElementById('yearRange');
  const yearValue = document.getElementById('yearValue');
  const districtSelect = document.getElementById('districtSelect');
  const chartTitle = document.getElementById('chartTitle');

  districts.forEach((d) => {
    const option = document.createElement('option');
    option.value = d.district;
    option.textContent = d.district;
    districtSelect.appendChild(option);
  });

  const getColor = (rainfall) => {
    if (rainfall > 1300) return '#08306b';
    if (rainfall > 1100) return '#08519c';
    if (rainfall > 950) return '#2171b5';
    if (rainfall > 800) return '#4292c6';
    return '#6baed6';
  };

  const markers = districts.map((d) => {
    const value = d.rainfall_mm[yearRange.value];
    const marker = L.circleMarker([d.lat, d.lon], {
      radius: Math.max(6, Math.min(18, value / 100)),
      color: '#0f172a',
      weight: 1,
      fillColor: getColor(value),
      fillOpacity: 0.8
    }).addTo(map);
    marker.bindPopup(`<strong>${d.district}</strong><br/>${yearRange.value}: ${value} mm`);
    marker.on('click', () => {
      districtSelect.value = d.district;
      updateChart();
    });
    return marker;
  });

  const chartCtx = document.getElementById('trendChart');
  const defaultDistrict = districts[0];

  const chart = new Chart(chartCtx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Rainfall (mm)',
        data: years.map((y) => defaultDistrict.rainfall_mm[String(y)]),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.2)',
        tension: 0.2,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { title: { display: true, text: 'mm' } }
      }
    }
  });

  function updateMarkers() {
    const year = yearRange.value;
    yearValue.textContent = year;
    districts.forEach((d, i) => {
      const rainfall = d.rainfall_mm[year];
      markers[i].setStyle({
        radius: Math.max(6, Math.min(18, rainfall / 100)),
        fillColor: getColor(rainfall)
      });
      markers[i].setPopupContent(`<strong>${d.district}</strong><br/>${year}: ${rainfall} mm`);
    });
  }

  function updateChart() {
    const selected = districts.find((d) => d.district === districtSelect.value) || defaultDistrict;
    chartTitle.textContent = `${selected.district} Rainfall Trend (2005–2024)`;
    chart.data.datasets[0].data = years.map((y) => selected.rainfall_mm[String(y)]);
    chart.update();
  }

  yearRange.addEventListener('input', updateMarkers);
  districtSelect.addEventListener('change', updateChart);

  districtSelect.value = defaultDistrict.district;
  updateMarkers();
  updateChart();
}

init();
