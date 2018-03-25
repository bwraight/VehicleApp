package com.wraight.VehicleApp.domain.Customer;

import com.wraight.VehicleApp.domain.Vehicles.Vehicle;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Customer {
    private @Id @GeneratedValue Long id;
    private String email;
    private String firstName;
    private String lastName;

    @OneToMany(fetch = FetchType.EAGER, mappedBy="customer", cascade = CascadeType.ALL)
    private List<Vehicle> vehicles = new ArrayList<>();

    private Customer(){
    };

    public Customer(String email, String firstName, String lastName) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

}
