package de.iu.planetpulse.repository;

import de.iu.planetpulse.model.EmissionEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmissionRepository extends JpaRepository<EmissionEntry, Long> {
    List<EmissionEntry> findByApprovedTrue();  // Für die Bürger-Tabelle
    List<EmissionEntry> findByApprovedFalse(); // Für die Herausgeber-Prüfung
    // für die Filter-Buttons:
    List<EmissionEntry> findByType(String type);
}