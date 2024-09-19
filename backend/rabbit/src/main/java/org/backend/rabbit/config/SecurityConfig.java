package org.backend.rabbit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // This uses the BCrypt hashing algorithm
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Disabling CSRF protection, suitable for APIs where bearer tokens are more appropriate.
                .authorizeHttpRequests(authz -> authz
                        .anyRequest().permitAll())  // Require authentication for all other requests
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("/", true)  // Redirect here after a successful login
                        .failureUrl("/login?error=true"))  // Redirect here after a failed login
                .formLogin(form -> form.disable())  // Optional: Disable if you're using OAuth2
                .httpBasic(httpBasic -> httpBasic.disable());  // Optional: Disable if you're using OAuth2

        return http.build();
    }
}
