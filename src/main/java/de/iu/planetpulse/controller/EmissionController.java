package de.iu.planetpulse.controller;

import de.iu.planetpulse.model.EmissionEntry;
import de.iu.planetpulse.repository.EmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emissions")
@CrossOrigin(origins = "*") // Erlaubt den Zugriff vom Frontend
public class EmissionController {

    @Autowired
    private EmissionRepository repository;

    // MUST 1: Bürger sehen NUR freigegebene Daten
    @GetMapping
    public List<EmissionEntry> getApprovedEmissions() {
        return repository.findByApprovedTrue();
    }

    // Herausgeber sieht ausstehende Daten
    @GetMapping("/pending")
    public List<EmissionEntry> getPendingEmissions() {
    return repository.findByApprovedFalse();
    }

    @PutMapping("/{id}")
    public EmissionEntry updateEmission(@PathVariable Long id, @RequestBody EmissionEntry newDetails) {
        return repository.findById(id).map(entry -> {
            entry.setLabel(newDetails.getLabel());
            entry.setType(newDetails.getType());
            entry.setEmissions(newDetails.getEmissions());
            entry.setApproved(false); // Nach Korrektur muss erneut freigegeben werden!
            return repository.save(entry);
        }).orElseThrow(() -> new RuntimeException("Eintrag nicht gefunden"));
    }

    // MUST 2: Neuen Datensatz anlegen (Wissenschaftler-Sicht)
    @PostMapping
    public EmissionEntry addEmission(@RequestBody EmissionEntry entry) {
        // Security-Check: Hier würde später die Prüfung der Rechte erfolgen
        return repository.save(entry);
    }

    @DeleteMapping("/{id}")
    public void deleteEntry(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Eintrag mit ID " + id + " existiert nicht.");
        }
        repository.deleteById(id);
    }
}