package org.backend.rabbit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class RabbitApplication {

	public static void main(String[] args) {
		SpringApplication.run(RabbitApplication.class, args);
	}

}
