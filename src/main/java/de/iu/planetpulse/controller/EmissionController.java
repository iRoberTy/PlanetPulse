package de.iu.planetpulse.controller;

import de.iu.planetpulse.model.EmissionEntry;
import de.iu.planetpulse.repository.EmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emissions")
public class EmissionController {

    @Autowired
    private EmissionRepository repository;

    // Öffentliche Daten (Nur freigegebene)
    @GetMapping
    public List<EmissionEntry> getPublicData() {
        return repository.findByApprovedTrue();
    }

    // Herausgeber-Daten (Nur unbestätigte)
    @GetMapping("/pending")
    public List<EmissionEntry> getPendingData() {
        return repository.findByApprovedFalse();
    }

    // Neuer Eintrag (Immer unbestätigt)
    @PostMapping
    public EmissionEntry createEntry(@RequestBody EmissionEntry entry) {
        entry.setApproved(false);
        return repository.save(entry);
    }

    // Korrektur bestehender Daten (Setzt Status zurück auf unbestätigt)
    @PutMapping("/{id}")
    public EmissionEntry updateEntry(@PathVariable Long id, @RequestBody EmissionEntry details) {
        EmissionEntry entry = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ID nicht gefunden"));
        
        entry.setLabel(details.getLabel());
        entry.setEmissions(details.getEmissions());
        entry.setType(details.getType());
        entry.setApproved(false); // Erneute Prüfung erforderlich
        
        return repository.save(entry);
    }

    // Freigabe durch Herausgeber
    @PutMapping("/{id}/approve")
    public EmissionEntry approveEntry(@PathVariable Long id) {
        EmissionEntry entry = repository.findById(id).orElseThrow();
        entry.setApproved(true);
        return repository.save(entry);
    }

    // Löschen (Ablehnung)
    @DeleteMapping("/{id}")
    public void deleteEntry(@PathVariable Long id) {
        repository.deleteById(id);
    }
}