const fs = require('fs');
const data = JSON.parse(fs.readFileSync('puc-notes-solutions-log-export-2026-08-11T10-15-19.json', 'utf8'));

console.log(`Total Requests: ${data.length}`);

const pathCounts = {};
let rscRequests = 0;
const rscCounts = {};

for (const req of data) {
    const path = req.requestPath;
    pathCounts[path] = (pathCounts[path] || 0) + 1;
    
    if (req.requestQueryString && req.requestQueryString.includes('_rsc')) {
        rscRequests++;
        rscCounts[path] = (rscCounts[path] || 0) + 1;
    }
}

console.log('--- Top 10 Paths ---');
Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([path, count]) => console.log(`${count}: ${path}`));

console.log('\n--- Requests with _rsc ---');
console.log(`Total _rsc requests: ${rscRequests}`);
Object.entries(rscCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([path, count]) => console.log(`${count}: ${path}`));
