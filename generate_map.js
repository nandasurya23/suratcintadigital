const fs = require('fs');
const fetch = require('node-fetch');
const topojson = require('topojson-client');
const d3 = require('d3-geo');

async function generateMap() {
    console.log("Fetching Highcharts TopoJSON for Indonesia...");
    const res = await fetch('https://code.highcharts.com/mapdata/countries/id/id-all.topo.json');
    const topo = await res.json();
    
    console.log("Converting TopoJSON to GeoJSON...");
    const geojson = topojson.feature(topo, topo.objects.default);

    const width = 800;
    const height = 400;

    // Use Mercator or Equirectangular projection
    const projection = d3.geoMercator()
        .fitSize([width, height], geojson);

    const pathGenerator = d3.geoPath().projection(projection);

    const svgPaths = geojson.features.map(feature => {
        const d = pathGenerator(feature);
        return `<path d="${d}" fill="var(--color-primary)" opacity="0.6" stroke="var(--color-dark)" stroke-width="0.5"/>`;
    }).join('\n');

    // Also let's project Bali and Palembang!
    // Bali: -8.409518, 115.188919
    // Palembang: -2.990934, 104.756554
    const baliXY = projection([115.188919, -8.409518]);
    const plgXY = projection([104.756554, -2.990934]);

    console.log(`Bali Coordinates (SVG): ${baliXY}`);
    console.log(`Palembang Coordinates (SVG): ${plgXY}`);

    const svgDoc = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <g id="realMapGroup">
            ${svgPaths}
        </g>
    </svg>`;

    fs.writeFileSync('assets/indonesia-map-accurate.svg', svgDoc);
    
    // Save coordinates to a file so we know what they are
    fs.writeFileSync('assets/map-coords.json', JSON.stringify({ bali: baliXY, palembang: plgXY }));
    console.log("SVG saved to assets/indonesia-map-accurate.svg");
}

generateMap().catch(console.error);
