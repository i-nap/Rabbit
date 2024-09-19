//package org.backend.rabbit.services;
//
//import org.backend.rabbit.model.User;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.stereotype.Service;
//
//import java.time.Instant;
//
//@Service
//public class RedisTestService {
//
//    @Autowired
//    private RedisTemplate<String, User> userRedisTemplate;
//
//    public void testRedis() {
//        // Create a User object
//        User testUser = new User();
//        testUser.setUsername("testuser");
//        testUser.setCreatedAt(Instant.now());
//
//        // Store the User object in Redis
//        userRedisTemplate.opsForValue().set("user_test", testUser);
//
//        // Retrieve the User object from Redis
//        User retrievedUser = userRedisTemplate.opsForValue().get("user_test");
//        if (retrievedUser != null) {
//            System.out.println("Retrieved User: " + retrievedUser.getCreatedAt());
//        }
//    }
//}
