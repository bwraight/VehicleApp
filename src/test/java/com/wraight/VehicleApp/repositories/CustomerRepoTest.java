package com.wraight.VehicleApp.repositories;

import com.wraight.VehicleApp.domain.Customer.Customer;
import com.wraight.VehicleApp.repositories.CustomerRepo;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CustomerRepoTest {

    @Autowired
    private CustomerRepo customerRepo;

    private final String EMAIL = "dave.jones@gmail.com";
    private final String FIRST_NAME = "dave";
    private final String LAST_NAME = "jones";

    @Test
    public void testFindByEmail() {
        customerRepo.save(new Customer(EMAIL, FIRST_NAME,LAST_NAME));
        Customer customer = customerRepo.findByEmail(EMAIL);
        Assert.assertNotNull(customer.getId());
    }
}