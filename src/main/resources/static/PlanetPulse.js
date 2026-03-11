/* ========== Globale Variablen & Initialisierung ========== */
let data = []; // Speicher für öffentliche Bürger-Daten
let currentEditId = null; // Speichert die ID, wenn ein Datensatz korrigiert wird
let currentFilter = "all";
let sortKey = null;
let sortDirection = "asc";

// Initialisierung beim Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
    // Herausgeber-Bereich strikt verstecken
    const adminArea = document.getElementById("scientist-area");
    if (adminArea) adminArea.style.display = "none";
    
    init(); // Öffentliche Daten laden
});

async function init() {
    try {
        console.log("Lade öffentliche Daten...");
        const response = await fetch('/api/emissions');
        data = await response.json();
        renderTable(); 
    } catch (error) {
        console.error("Fehler beim Initialisieren:", error);
    }
}

function renderTable(filter = currentFilter) {
    const body = document.getElementById("table-body");
    if (!body) return;
    body.innerHTML = "";

    // Prüfen, ob wir im Experten-Modus sind
    const isLoggedIn = document.getElementById("scientist-area").style.display === "block";

    let filtered = filter === "all" ? data : data.filter(e => e.type === filter);

    // Header-Logik: Falls wir die Spalte "Aktionen" im HTML-Head haben, 
    // sollte dieser auch nur bei Login sichtbar sein. 
    // Hier fügen wir einfach die Zellen dynamisch ein:
    filtered.forEach(entry => {
        let row = `
            <tr>
                <td>${entry.label}</td>
                <td>${entry.type === "country" ? "Land" : "Unternehmen"}</td>
                <td>${entry.emissions.toLocaleString("de-DE")} t</td>`;
        
        // Wenn eingeloggt, füge die Korrektur-Zelle hinzu
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

/* ========== Authentifizierung ========== */

// Diese Funktion sorgt für den Wechsel
async function handleLogin(event) {
    if (event) event.preventDefault(); 

    const userVal = document.getElementById("username").value;
    const passVal = document.getElementById("password").value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userVal, password: passVal })
        });

        const result = await response.json(); 

        if (result.success) {
            // 1. UI Sichtbarkeit umschalten
            document.getElementById("login-section").style.display = "none";
            const adminArea = document.getElementById("scientist-area");
            adminArea.style.setProperty("display", "block", "important"); 
            
            // 2. SOFORTIGE AKTUALISIERUNG (Der entscheidende Teil)
            await init();         // Lädt die Hauptdaten neu und rendert die "Korrektur"-Buttons
            await fetchPending(); // Lädt die Warteschlange für Herausgeber
            
            alert("Erfolgreich authentifiziert. Bearbeitungsmodus aktiviert.");
        } else {
            alert("Zugriff verweigert.");
        }
    } catch (e) {
        console.error("Login Fehler", e);
    }
}

/* ========== Wissenschaftler-Sicht: Daten erfassen & korrigieren ========== */

async function saveData() {
    const labelInput = document.getElementById("newLabel");
    const typeInput = document.getElementById("newType");
    const emissionsInput = document.getElementById("newEmissions");

    const entry = {
        label: labelInput.value,
        type: typeInput.value,
        emissions: parseInt(emissionsInput.value)
    };

    if (!entry.label || isNaN(entry.emissions)) {
        alert("Bitte füllen Sie alle Felder korrekt aus!");
        return;
    }

    const method = currentEditId ? 'PUT' : 'POST';
    const url = currentEditId ? `/api/emissions/${currentEditId}` : '/api/emissions';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        });

        if (response.ok) {
            alert(currentEditId ? "Datenfehler erfolgreich korrigiert!" : "Daten erfolgreich zur Prüfung eingereicht!");
            resetForm();
            fetchPending(); // Admin-Tabelle aktualisieren
        }
    } catch (err) {
        alert("Fehler beim Speichern der Daten.");
    }
}

// Lädt Daten zur Korrektur in das Formular (User Story: Datenfehler korrigieren)
function prepareEdit(id, label, emissions, type) {
    currentEditId = id;
    document.getElementById("newLabel").value = label;
    document.getElementById("newEmissions").value = emissions;
    document.getElementById("newType").value = type;

    const saveBtn = document.querySelector("#scientist-area button.btn-primary");
    if (saveBtn) {
        saveBtn.innerText = "Änderung bestätigen";
        saveBtn.classList.replace("btn-primary", "btn-warning");
    }
    // Hochscrollen zum Formular
    window.scrollTo({ top: document.getElementById("scientist-area").offsetTop - 50, behavior: 'smooth' });
}

function resetForm() {
    currentEditId = null;
    document.getElementById("newLabel").value = "";
    document.getElementById("newEmissions").value = "";
    const saveBtn = document.querySelector("#scientist-area button.btn-warning");
    if (saveBtn) {
        saveBtn.innerText = "Speichern";
        saveBtn.classList.replace("btn-warning", "btn-primary");
    }
}

/* ========== Herausgeber-Sicht: Freigabe & Löschen (COULD) ========== */

async function fetchPending() {
    try {
        const response = await fetch('/api/emissions/pending');
        const pendingData = await response.json();
        renderPendingTable(pendingData);
    } catch (error) {
        console.error("Fehler beim Laden der ausstehenden Daten:", error);
    }
}

function renderPendingTable(pendingEntries) {
    const body = document.getElementById("pending-body");
    if (!body) return;
    body.innerHTML = "";

    if (pendingEntries.length === 0) {
        body.innerHTML = '<tr><td colspan="4" class="text-muted text-center">Keine neuen Daten zur Prüfung.</td></tr>';
        return;
    }

    pendingEntries.forEach(entry => {
        body.innerHTML += `
            <tr>
                <td>${entry.label}</td>
                <td>${entry.type === "country" ? "Land" : "Unternehmen"}</td>
                <td>${entry.emissions.toLocaleString("de-DE")} t</td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-success" onclick="approveEntry(${entry.id})">Freigeben</button>
                        <button class="btn btn-sm btn-warning" onclick="prepareEdit(${entry.id}, '${entry.label}', ${entry.emissions}, '${entry.type}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteEntry(${entry.id})">Löschen</button>
                    </div>
                </td>
            </tr>`;
    });
}

async function approveEntry(id) {
    try {
        const response = await fetch(`/api/emissions/${id}/approve`, {
            method: 'PUT'
        });

        if (response.ok) {
            alert("Datensatz freigegeben!");
            await fetchPending(); // Warteschlange aktualisieren
            await init();         // Haupttabelle aktualisieren
        } else {
            const err = await response.text();
            console.error("Server-Antwort:", err);
        }
    } catch (error) {
        alert("Netzwerkfehler bei Freigabe");
    }
}

async function deleteEntry(id) {
    if (!confirm("Datensatz wirklich unwiderruflich löschen?")) return;
    try {
        const response = await fetch(`/api/emissions/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert("Datensatz gelöscht.");
            fetchPending();
        }
    } catch (error) {
        alert("Fehler beim Löschen.");
    }
}