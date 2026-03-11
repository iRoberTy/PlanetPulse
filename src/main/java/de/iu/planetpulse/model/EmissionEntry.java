package de.iu.planetpulse.model;

import jakarta.persistence.*;

@Entity
@Table(name = "emissions")
public class EmissionEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // "country" oder "company"

    @Column(nullable = false, unique = true) // 'unique = true' verhindert doppelte Labels)
    private String label;

    @Column(nullable = false)
    private Long emissions; // (Milliarden-Beträge Tonnen)

    @Column(nullable = false)
    private boolean approved = false; // Standardmäßig nicht freigegeben

    // Konstruktoren
    public EmissionEntry() {}

    public EmissionEntry(String type, String label, Long emissions) {
        this.type = type;
        this.label = label;
        this.emissions = emissions;
    }

    // Getter und Setter
    public Long getId() { return id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public Long getEmissions() { return emissions; }
    public void setEmissions(Long emissions) { this.emissions = emissions; }
    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }
}