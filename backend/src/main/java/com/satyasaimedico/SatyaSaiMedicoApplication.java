package com.satyasaimedico;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ============================================================
 * MAIN APPLICATION CLASS
 * ============================================================
 *
 * @SpringBootApplication is a COMBO annotation that includes:
 *   1. @Configuration     → This class can define beans
 *   2. @EnableAutoConfiguration → Spring Boot auto-configures
 *      based on dependencies in pom.xml (e.g., sees MySQL driver
 *      → auto-configures DataSource)
 *   3. @ComponentScan     → Scans this package and sub-packages
 *      for @Controller, @Service, @Repository, @Component
 *
 * HOW IT WORKS INTERNALLY:
 * 1. SpringApplication.run() starts the embedded Tomcat server
 * 2. Spring scans for all annotated classes
 * 3. Creates and wires all beans (Dependency Injection)
 * 4. Connects to MySQL using application.properties config
 * 5. Application is ready to receive HTTP requests
 */
@SpringBootApplication
public class SatyaSaiMedicoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SatyaSaiMedicoApplication.class, args);
    }
}
