/* ========== Globale Variablen ========== */
let data = []; 
let currentEditId = null; 
let currentFilter = "all";
let sortKey = null;
let sortDirection = "asc";

/* ========== Initialisierung ========== */
document.addEventListener("DOMContentLoaded", () => {
    init(); 
});

async function init() {
    try {
        const response = await fetch('/api/emissions');
        data = await response.json();
        renderTable(); 
    } catch (error) {
        console.error("Fehler beim Laden der öffentlichen Daten:", error);
    }
}

/* ========== Haupttabelle (Bürger-Sicht & Korrektur-Einstieg) ========== */
function renderTable(filter = currentFilter, btn = null) {
    currentFilter = filter;
    if (btn) {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    }

    const body = document.getElementById("table-body");
    if (!body) return;

    // 1. Daten filtern
    let filtered = filter === "all" ? [...data] : data.filter(e => e.type === filter);

    // 2. Daten sortieren (Falls ein Key gesetzt ist)
    if (sortKey) {
        filtered.sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];

            if (typeof valA === 'string') {
                // String-Vergleich für Namen (beachtet Umlaute)
                return sortDirection === "asc" 
                    ? valA.localeCompare(valB) 
                    : valB.localeCompare(valA);
            } else {
                // Numerischer Vergleich für Emissionen
                return sortDirection === "asc" ? valA - valB : valB - valA;
            }
        });
    }

    // 3. Tabelle rendern
    const isLoggedIn = document.getElementById("scientist-area").style.display === "block";
    body.innerHTML = "";

    filtered.forEach(entry => {
        let row = `<tr>
            <td>${entry.label}</td>
            <td>${entry.type === "country" ? "Land" : "Unternehmen"}</td>
            <td>${entry.emissions.toLocaleString("de-DE")} t</td>`;
        
        if (isLoggedIn) {
            row += `<td>
                <button class="btn btn-sm btn-outline-warning" 
                        onclick="prepareEdit(${entry.id}, '${entry.label}', ${entry.emissions}, '${entry.type}')">
                    Korrektur
                </button>
            </td>`;
        }
        row += `</tr>`;
        body.innerHTML += row;
    });
}

/* ========== Authentifizierung mit Rollentrennung ========== */
async function handleLogin(event) {
    if (event) event.preventDefault(); 
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json(); 

        if (result.success) {
            // Login-Maske weg, Experten-Bereich her
            document.getElementById("login-section").style.display = "none";
            document.getElementById("scientist-area").style.setProperty("display", "block", "important");

            // Spezifische Sicht für Herausgeber (EDITOR) freischalten
            const editorSection = document.getElementById("editor-only-section");
            if (result.role === "EDITOR") {
                editorSection.style.display = "block";
                fetchPending(); 
            } else {
                editorSection.style.display = "none";
            }
            
            renderTable(); // Tabelle neu zeichnen, um Korrektur-Buttons einzublenden
            alert(`Willkommen! Rolle: ${result.role}`);
        } else {
            alert("Anmeldung fehlgeschlagen.");
        }
    } catch (e) {
        alert("Verbindung zum Auth-Service fehlgeschlagen.");
    }
}

/* ========== Daten-Management (Korrektur & Speichern) ========== */
async function saveData() {
    const label = document.getElementById("newLabel").value;
    const type = document.getElementById("newType").value;
    const emissions = parseInt(document.getElementById("newEmissions").value);

    if (!label || isNaN(emissions)) return alert("Bitte alle Felder ausfüllen!");

    const entry = { label, type, emissions };
    const method = currentEditId ? 'PUT' : 'POST';
    const url = currentEditId ? `/api/emissions/${currentEditId}` : '/api/emissions';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        });

        if (response.ok) {
            alert(currentEditId ? "Korrektur eingereicht!" : "Neu angelegt!");
            resetForm();
            // Falls Editor, Liste der ausstehenden Freigaben direkt aktualisieren
            if (document.getElementById("editor-only-section").style.display === "block") {
                fetchPending();
            }
        }
    } catch (err) {
        alert("Fehler beim Senden der Daten.");
    }
}

function prepareEdit(id, label, emissions, type) {
    currentEditId = id;
    document.getElementById("newLabel").value = label;
    document.getElementById("newEmissions").value = emissions;
    document.getElementById("newType").value = type;

    const btn = document.getElementById("save-btn");
    btn.innerText = "Änderung bestätigen";
    btn.classList.replace("btn-primary", "btn-warning");
    
    // Scrollt sanft zum Bearbeitungs-Formular
    document.getElementById("scientist-area").scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    currentEditId = null;
    document.getElementById("newLabel").value = "";
    document.getElementById("newEmissions").value = "";
    const btn = document.getElementById("save-btn");
    btn.innerText = "Speichern";
    btn.classList.replace("btn-warning", "btn-primary");
}

/* ========== Herausgeber-Logik (Freigabe & Ablehnung) ========== */
async function fetchPending() {
    try {
        const response = await fetch('/api/emissions/pending');
        const pendingData = await response.json();
        const body = document.getElementById("pending-body");
        body.innerHTML = "";

        if (pendingData.length === 0) {
            body.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Keine neuen Anfragen.</td></tr>';
            return;
        }

        pendingData.forEach(e => {
            body.innerHTML += `<tr>
                <td>${e.label}</td>
                <td>${e.type === "country" ? "Land" : "Firma"}</td>
                <td>${e.emissions.toLocaleString()} t</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-success" onclick="approveEntry(${e.id})">Freigeben</button>
                        <button class="btn btn-sm btn-outline-warning" onclick="prepareEdit(${e.id}, '${e.label}', ${e.emissions}, '${e.type}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteEntry(${e.id})">Löschen</button>
                    </div>
                </td>
            </tr>`;
        });
    } catch (err) {
        console.error("Pending-Daten konnten nicht geladen werden.");
    }
}

async function approveEntry(id) {
    const response = await fetch(`/api/emissions/${id}/approve`, { method: 'PUT' });
    if (response.ok) {
        fetchPending();
        init(); // Bürger-Tabelle aktualisieren
    }
}

async function deleteEntry(id) {
    if (confirm("Möchten Sie diesen Eintrag wirklich löschen?") && 
        await fetch(`/api/emissions/${id}`, { method: 'DELETE' })) {
        fetchPending();
    }
}

function sortBy(key, th) {
    // Falls auf die gleiche Spalte geklickt wird: Richtung umkehren
    if (sortKey === key) {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
        sortKey = key;
        sortDirection = "asc";
    }

    // Visuelles Feedback: Alle anderen Pfeile entfernen und beim aktuellen Header setzen
    document.querySelectorAll("#co2-table th").forEach(header => {
        header.innerText = header.innerText.replace(" ▲", "").replace(" ▼", "");
    });
    th.innerText += sortDirection === "asc" ? " ▲" : " ▼";

    renderTable(); // Tabelle mit neuen Sortier-Einstellungen neu zeichnen
}