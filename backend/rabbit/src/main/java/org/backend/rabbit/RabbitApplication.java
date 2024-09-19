package org.backend.rabbit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
//@EnableCaching
public class RabbitApplication {
//	@Autowired
//	private RedisTestService redisTestService;
	public static void main(String[] args) {
		SpringApplication.run(RabbitApplication.class, args);
	}

//	@EventListener(ApplicationReadyEvent.class)
//	public void runRedisTest() {
//		// Call the test method in RedisTestService after the application starts
//		redisTestService.testRedis();
//	}
}
