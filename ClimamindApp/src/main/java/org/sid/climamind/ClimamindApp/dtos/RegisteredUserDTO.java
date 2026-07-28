package org.sid.climamind.ClimamindApp.dtos;

import lombok.Data;

@Data
public class RegisteredUserDTO {
    private long id;
    private String name;
    private String email;
}
