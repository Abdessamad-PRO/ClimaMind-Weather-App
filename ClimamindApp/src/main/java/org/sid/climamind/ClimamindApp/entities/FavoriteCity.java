package org.sid.climamind.ClimamindApp.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteCity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cityName;
    private double latitude;
    private double longitude;
    @ManyToOne(fetch = FetchType.LAZY)
    private RegisteredUser user;
}
