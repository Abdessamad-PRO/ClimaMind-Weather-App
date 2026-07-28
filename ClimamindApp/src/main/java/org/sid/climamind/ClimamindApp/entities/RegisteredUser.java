package org.sid.climamind.ClimamindApp.entities;


import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("REGISTERED")
@NoArgsConstructor
@AllArgsConstructor
public class RegisteredUser extends Users {
    private String email;
    private String password;
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<FavoriteCity> favoriteCities;
}
