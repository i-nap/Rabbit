//package org.backend.rabbit.config;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
//import org.backend.rabbit.model.Otp;
//import org.backend.rabbit.model.User;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.redis.connection.RedisConnectionFactory;
//import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
//import org.springframework.data.redis.serializer.StringRedisSerializer;
//
//@Configuration
//public class RedisConfig {
//
//    @Bean
//    public RedisConnectionFactory redisConnectionFactory() {
//        return new LettuceConnectionFactory();
//    }
//    @Bean
//    public RedisTemplate<String, User> userRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
//        RedisTemplate<String, User> template = new RedisTemplate<>();
//        template.setConnectionFactory(redisConnectionFactory);
//
//        // Key serializer as String
//        template.setKeySerializer(new StringRedisSerializer());
//
//        // ObjectMapper to handle Java 8 date/time types
//        ObjectMapper objectMapper = new ObjectMapper();
//        objectMapper.registerModule(new JavaTimeModule()); // Register module to handle Instant
//
//        // Use the ObjectMapper for JSON serialization and deserialization
//        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(objectMapper);
//
//        // Set the value serializer for User objects
//        template.setValueSerializer(serializer);
//
//        return template;
//    }
//    @Bean
//    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
//        RedisTemplate<String, Object> template = new RedisTemplate<>();
//        template.setConnectionFactory(redisConnectionFactory);
//
//        // Create and configure ObjectMapper with JavaTimeModule for Java 8 time types
//        ObjectMapper objectMapper = new ObjectMapper();
//        objectMapper.registerModule(new JavaTimeModule());
//
//        // Use the custom ObjectMapper with the serializer
//        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(objectMapper);
//
//        // Set key and value serializers
//        template.setKeySerializer(new StringRedisSerializer());
//        template.setValueSerializer(serializer);
//
//        return template;
//    }
//
//    // Define RedisTemplate for OTP objects if necessary
//    @Bean
//    public RedisTemplate<String, Otp> otpRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
//        RedisTemplate<String, Otp> template = new RedisTemplate<>();
//        template.setConnectionFactory(redisConnectionFactory);
//
//        // Use the same ObjectMapper with JavaTimeModule for OTP serialization
//        ObjectMapper objectMapper = new ObjectMapper();
//        objectMapper.registerModule(new JavaTimeModule());
//        template.setKeySerializer(new StringRedisSerializer());
//        template.setValueSerializer(new GenericJackson2JsonRedisSerializer(objectMapper));
//
//        return template;
//    }
//}
