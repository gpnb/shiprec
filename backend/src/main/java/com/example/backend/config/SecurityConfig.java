package com.example.backend.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {



    @Bean // encrypts the passwords stored in the database using BCrypt hash function
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); 
    }

    @Bean // function that allows requests from frontend
       public CorsConfigurationSource corsConfigurationSource() {
        
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration configuration = new CorsConfiguration();
        configuration.applyPermitDefaultValues();
        // the REST API methods allowed
		configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
        // any domain can make requests to the server
        // configuration.setAllowedOriginPatterns(Arrays.asList("*"));

        // Added by Maria
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedHeaders(Arrays.asList("*")); // allow all headers
        configuration.setAllowCredentials(true);
        // End of added by Maria

        // send header to the client
        configuration.addExposedHeader("Authorization");
        configuration.setAllowCredentials(true);
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}


      @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http 
            // enable cors, according to the configuration in corsConfigurationSource
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // disable csrf protection
            .csrf(csrf -> csrf.disable()) 
            // allow all requests made to /SignUp/signup and welcome page; for all other pages the user has to be authenticated
            .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                .anyRequest().permitAll()) 
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) 
                .build(); 
    }

    






}
