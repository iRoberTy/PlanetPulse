<script type="text/babel"></script>
import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const allData = [
  // Unternehmen-Daten
  { label1: "USA", label2: "ExxonMobil", emissions: 577000000 },
  { label1: "USA", label2: "Chevron", emissions: 513000000 },
  { label1: "China", label2: "China Energy", emissions: 570000000 },
  { label1: "China", label2: "PetroChina", emissions: 520000000 },
  { label1: "China", label2: "Sinopec", emissions: 480000000 },
  { label1: "Saudi-Arabien", label2: "Saudi Aramco", emissions: 526000000 },
  { label1: "Russland", label2: "Gazprom", emissions: 463000000 },
  { label1: "Russland", label2: "Rosneft", emissions: 400000000 },
  { label1: "Indien", label2: "Coal India", emissions: 362000000 },
  { label1: "Deutschland", label2: "RWE", emissions: 126000000 },
  { label1: "Deutschland", label2: "BASF", emissions: 70000000 },
  { label1: "Deutschland", label2: "Volkswagen", emissions: 80000000 },
  { label1: "Australien", label2: "BHP", emissions: 80000000 },
  { label1: "Brasilien", label2: "Petrobras", emissions: 73000000 },
  { label1: "Kanada", label2: "Suncor Energy", emissions: 69000000 },
  { label1: "Frankreich", label2: "TotalEnergies", emissions: 65000000 },
  { label1: "Japan", label2: "Mitsubishi", emissions: 60000000 },
  { label1: "Japan", label2: "Tokyo Electric Power", emissions: 55000000 },
  { label1: "UK", label2: "BP", emissions: 420000000 },
  { label1: "Norwegen", label2: "Equinor", emissions: 200000000 },
  { label1: "Mexiko", label2: "Pemex", emissions: 180000000 },
  { label1: "Südafrika", label2: "Sasol", emissions: 160000000 },
  { label1: "Venezuela", label2: "PDVSA", emissions: 140000000 },
  { label1: "Italien", label2: "Eni", emissions: 130000000 },
  { label1: "Südkorea", label2: "POSCO", emissions: 100000000 },
];

const CO2Table = () => {
  const [view, setView] = useState("all"); // all | countries | companies
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredData =
    view === "countries"
      ? allData.map(({ label1, label2, emissions }) => ({
          label1: label2,
          label2: label1,
          emissions,
        }))
      : view === "companies"
      ? allData.map(({ label1, label2, emissions }) => ({
          label1: label2,
          label2: label1,
          emissions,
        }))
      : allData;

  const sortedData = [...filteredData].sort((a, b) => {
    const key = sortConfig.key;
    if (!key) return 0;
    const aVal = a[key];
    const bVal = b[key];
    if (typeof aVal === "number") {
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    }
    return sortConfig.direction === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  return (
    <div className="w-100">
      <div className="table-responsive shadow rounded">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-primary" style={{ backgroundColor: "#284F8F", color: "#fff" }}>
            <tr>
              <th
                className="sortable"
                onClick={() => handleSort("label1")}
                style={{ cursor: "pointer" }}
              >
                {view === "countries"
                  ? "Unternehmen"
                  : view === "companies"
                  ? "Land"
                  : "Land"}
                {sortConfig.key === "label1" ? (sortConfig.direction === "asc" ? " ▲" : " ▼") : ""}
              </th>
              <th
                className="sortable"
                onClick={() => handleSort("label2")}
                style={{ cursor: "pointer" }}
              >
                {view === "countries"
                  ? "Land"
                  : view === "companies"
                  ? "Unternehmen"
                  : "Unternehmen"}
                {sortConfig.key === "label2" ? (sortConfig.direction === "asc" ? " ▲" : " ▼") : ""}
              </th>
              <th
                className="sortable"
                onClick={() => handleSort("emissions")}
                style={{ cursor: "pointer" }}
              >
                CO₂-Emissionen (t/Jahr)
                {sortConfig.key === "emissions"
                  ? sortConfig.direction === "asc"
                    ? " ▲"
                    : " ▼"
                  : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, i) => (
              <tr key={i}>
                <td>{item.label1}</td>
                <td>{item.label2}</td>
                <td>{item.emissions.toLocaleString("de-DE")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons direkt hier eingebunden */}
      <div className="d-flex justify-content-center mt-4 gap-2">
        <button
          className={`btn ${view === "all" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setView("all")}
        >
          Alles anzeigen
        </button>
        <button
          className={`btn ${view === "countries" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setView("countries")}
        >
          Nur Länder
        </button>
        <button
          className={`btn ${view === "companies" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setView("companies")}
        >
          Nur Unternehmen
        </button>
      </div>
    </div>
  );
};

// Mounten
const rootElement = document.getElementById("co2-table-root");
const root = createRoot(rootElement);
root.render(<CO2Table />);