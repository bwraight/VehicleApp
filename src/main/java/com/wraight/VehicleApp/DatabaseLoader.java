package com.wraight.VehicleApp;

import com.wraight.VehicleApp.domain.Customer.Customer;
import com.wraight.VehicleApp.domain.Vehicles.Vehicle;
import com.wraight.VehicleApp.domain.Vehicles.VehicleType;
import com.wraight.VehicleApp.repositories.CustomerRepo;
import com.wraight.VehicleApp.repositories.VehicleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final VehicleRepo vehicleRepo;
    private final CustomerRepo customerRepo;

    @Autowired
    public DatabaseLoader(VehicleRepo vehicleRepo, CustomerRepo customerRepo) {
        this.vehicleRepo = vehicleRepo;
        this.customerRepo = customerRepo;
    }

    @Override
    public void run(String... strings) throws Exception {
        this.vehicleRepo.save(new Vehicle(4,5,"Ford", "Focus", VehicleType.CAR));
        Vehicle testVehicle = new Vehicle(4,5,"Ford", "Mondeo", VehicleType.CAR);
        this.vehicleRepo.save(testVehicle);
        this.customerRepo.save(new Customer("john.doe@gmail.com","John","Doe"));
        Customer testCustomer = new Customer("joe.bloggs@gmail.com","Joe","Bloggs");
        this.customerRepo.save(testCustomer);
        testVehicle.setCustomer(testCustomer);
        this.vehicleRepo.save(testVehicle);
    }
}