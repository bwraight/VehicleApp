package com.wraight.VehicleApp.domain.Vehicles;

import com.wraight.VehicleApp.domain.Customer.Customer;

import javax.persistence.*;
import java.util.Objects;

@Entity
public class Vehicle{

    private @Id @GeneratedValue Long id;
    private int numberOfWheels;
    private int numberOfPassengers;
    private String make;
    private String model;
    private VehicleType vehicleType;

    @ManyToOne(cascade= CascadeType.ALL)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private Vehicle(){
    };

    public Vehicle(int numberOfWheels, int numberOfPassengers, String make, String model, VehicleType vehicleType) {
        this.numberOfWheels = numberOfWheels;
        this.numberOfPassengers = numberOfPassengers;
        this.make = make;
        this.model = model;
        this.vehicleType = vehicleType;
    }

    public Long getId() {
        return id;
    }

    public int getNumberOfWheels() {
        return numberOfWheels;
    }

    public int getNumberOfPassengers() {
        return numberOfPassengers;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }

    public VehicleType getVehicleType() {
        return vehicleType;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Vehicle vehicle = (Vehicle) o;
        return numberOfWheels == vehicle.numberOfWheels &&
                numberOfPassengers == vehicle.numberOfPassengers &&
                Objects.equals(id, vehicle.id) &&
                Objects.equals(make, vehicle.make) &&
                Objects.equals(model, vehicle.model) &&
                vehicleType == vehicle.vehicleType;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, numberOfWheels, numberOfPassengers, make, model, vehicleType);
    }
}
