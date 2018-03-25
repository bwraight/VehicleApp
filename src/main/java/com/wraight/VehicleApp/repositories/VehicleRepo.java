package com.wraight.VehicleApp.repositories;

import com.wraight.VehicleApp.domain.Vehicles.Vehicle;
import org.springframework.data.repository.CrudRepository;

public interface VehicleRepo extends CrudRepository<Vehicle, Long> {
}
