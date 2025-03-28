const data = [
{ type: "country", label: "China", emissions: 11472000000 },
{ type: "country", label: "USA", emissions: 5007000000 },
{ type: "country", label: "Indien", emissions: 2654000000 },
{ type: "country", label: "Russland", emissions: 1688000000 },
{ type: "country", label: "Japan", emissions: 1042000000 },
{ type: "country", label: "Deutschland", emissions: 666000000 },
{ type: "country", label: "Iran", emissions: 690000000 },
{ type: "country", label: "Südkorea", emissions: 590000000 },
{ type: "country", label: "Indonesien", emissions: 615000000 },
{ type: "country", label: "Brasilien", emissions: 492000000 },

{ type: "company", label: "ExxonMobil", emissions: 577000000 },
{ type: "company", label: "Chevron", emissions: 513000000 },
{ type: "company", label: "Sinopec", emissions: 480000000 },
{ type: "company", label: "PetroChina", emissions: 520000000 },
{ type: "company", label: "Saudi Aramco", emissions: 526000000 },
{ type: "company", label: "Gazprom", emissions: 463000000 },
{ type: "company", label: "Rosneft", emissions: 400000000 },
{ type: "company", label: "Volkswagen", emissions: 80000000 },
{ type: "company", label: "Tokyo Electric Power", emissions: 55000000 },
{ type: "company", label: "Suncor Energy", emissions: 69000000 },
{ type: "company", label: "Petrobras", emissions: 73000000 },
{ type: "company", label: "BP", emissions: 420000000 }
];

let currentFilter = "all";
let sortKey = null;
let sortDirection = "asc";

function renderTable(filter = currentFilter, btn = null) {
currentFilter = filter;

// Button-Styling aktualisieren
document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
if (btn) btn.classList.add("active");

const body = document.getElementById("table-body");
body.innerHTML = "";

let filtered = filter === "all" ? data : data.filter(e => e.type === filter);

if (sortKey) {
filtered.sort((a, b) => {
  const aVal = a[sortKey];
  const bVal = b[sortKey];
  return typeof aVal === "number"
    ? (sortDirection === "asc" ? aVal - bVal : bVal - aVal)
    : (sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal));
});
}

for (const entry of filtered) {
body.innerHTML += `
  <tr>
    <td>${entry.label}</td>
    <td>${entry.type === "country" ? "Land" : "Unternehmen"}</td>
    <td>${entry.emissions.toLocaleString("de-DE")}</td>
  </tr>`;
}
}

function sortBy(key, th) {
const allTh = document.querySelectorAll("th");
allTh.forEach(t => t.classList.remove("sort-asc", "sort-desc"));

if (sortKey === key) {
sortDirection = sortDirection === "asc" ? "desc" : "asc";
} else {
sortKey = key;
sortDirection = "asc";
}

th.classList.add(sortDirection === "asc" ? "sort-asc" : "sort-desc");
renderTable();
}

renderTable();
