package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

@SpringBootApplication
/* public class DemoApplication implements CommandLineRunner { */
public class DemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	 @Autowired
	private JdbcTemplate jdbcTemplate;
/*
	@Override
	public void run(String... args) throws Exception {
		String sql = "Select * from customers";
		List<Customer> customers = jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(Customer.class));
		customers.forEach(System.out :: println);
	} */
}