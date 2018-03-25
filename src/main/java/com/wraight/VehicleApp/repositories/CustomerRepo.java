package com.wraight.VehicleApp.repositories;

import com.wraight.VehicleApp.domain.Customer.Customer;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface CustomerRepo extends CrudRepository<Customer, Long> {

    /**
     * Finds customer by using the email as a search criteria.
     * @param email
     * @return  A customer whose email is an exact match with the given email.
     *          If no persons is found, this method returns null.
     */
    public Customer findByEmail(@Param("email") String email);
}