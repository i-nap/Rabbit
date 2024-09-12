package org.backend.rabbit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // This uses BCrypt hashing algorithm
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)  // New way to disable CSRF in Spring Security 6.1+
                .authorizeHttpRequests((authz) -> authz
                        .anyRequest().permitAll()  // Allow all requests without authentication
                )
                .formLogin(AbstractHttpConfigurer::disable)  // Disable form login (optional)
                .httpBasic(AbstractHttpConfigurer::disable);  // Disable basic authentication (optional)

        return http.build();
    }
}