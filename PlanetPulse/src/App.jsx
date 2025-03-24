import React from "react";
import CO2Table from "./Table";
import './App.css';

function App() {
  return (
    <div>
      <CO2Table />
    </div>
  );
}
function App() {
  return (
    <div>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#284F8F" }}>
        <div className="container">
          <a className="navbar-brand" href="#">🌍 PlanetPulse</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><a className="nav-link active" href="#">Pulse</a></li>
              <li className="nav-item"><a className="nav-link" href="#">CO₂-Emissionen</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Bedrohung des Lebens</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Was kannst DU tun?</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hauptinhalt */}
      <main className="container py-5">
        <section id="introduction" className="text-center mb-5">
          <h1 className="fw-bold text-white">
            Willkommen bei <span style={{ color: "#AAD1E7" }}>PlanetPulse</span>
          </h1>
          <p className="lead">
            Erfahre mehr über den Klimawandel, CO<sub>2</sub>-Emissionen und deren Auswirkungen auf unseren Planeten.
          </p>
        </section>

        <section id="emissionen" className="mb-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h2 className="text-white">Jährliche CO<sub>2</sub>-Emissionen</h2>
              <p>
                CO<sub>2</sub>-Emissionen sind der Haupttreiber der globalen Erwärmung.
                Seit der industriellen Revolution haben menschliche Aktivitäten den CO<sub>2</sub>-Gehalt in der Atmosphäre um über 50 % erhöht.
              </p>
              <ul>
                <li>Die letzten zehn Jahre waren die wärmsten seit Beginn der Aufzeichnungen.</li>
                <li>Die globale Durchschnittstemperatur ist bereits um 1,2°C gestiegen.</li>
                <li>Steigende CO<sub>2</sub>-Werte führen zu extremeren Wetterbedingungen.</li>
              </ul>
            </div>
            <div className="col-lg-6 text-center">
              <img
                src="/Umweltverschmutzung.webp"
                className="img-fluid rounded shadow"
                alt="Umweltverschmutzung"
              />
            </div>
          </div>
        </section>

        <section id="natur">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 text-center">
              <img
                src="/Regenwald.webp"
                className="img-fluid rounded shadow"
                alt="Regenwald"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="text-white">Die Bedeutung der Natur</h2>
              <p>
                Bäume und Ozeane sind entscheidend für den Klimaschutz.
                Sie absorbieren jährlich etwa 50 % des durch Menschen verursachten CO<sub>2</sub>.
              </p>
              <p>
                Regenwälder, insbesondere der Amazonas, gelten als „Lungen der Erde“,
                doch sie sind durch Abholzung bedroht.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <ul className="nav justify-content-center mb-3">
            <li className="nav-item"><a href="#TBA" className="nav-link px-2 text-light">Spenden</a></li>
            <li className="nav-item"><a href="#TBA" className="nav-link px-2 text-light">Wissen</a></li>
            <li className="nav-item"><a href="#TBA" className="nav-link px-2 text-light">Kontakt</a></li>
            <li className="nav-item"><a href="#TBA" className="nav-link px-2 text-light">FAQs</a></li>
            <li className="nav-item"><a href="#TBA" className="nav-link px-2 text-light">Impressum</a></li>
          </ul>
          <p className="mb-0">&copy; 2025 PlanetPulse SE</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
