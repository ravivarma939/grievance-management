package com.example.api_gateway.config;
import com.example.api_gateway.security.JwtAuthFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder,
                               JwtAuthFilter jwtAuthFilter) {

        return builder.routes()
                // Public route for user registration (no JWT required, no stripPrefix)
                .route("public_user_register", r -> r
                        .path("/users/register")
                        .uri("lb://user-profile-service"))
                // Secured routes that require JWT (excluding /users/register)
                .route("secured_users_routes", r -> r
                        .path("/users/**")
                        .and()
                        .not(p -> p.path("/users/register"))
                        .filters(f -> f.stripPrefix(0)
                                .filter(jwtAuthFilter.apply(new JwtAuthFilter.Config())))
                        .uri("lb://user-profile-service"))
                .route("secured_grievance_routes", r -> r
                        .path("/grievance/**")
                        .filters(f -> f.stripPrefix(0)
                                .filter(jwtAuthFilter.apply(new JwtAuthFilter.Config())))
                        .uri("lb://grievance-service"))
                .route("secured_bookmark_routes", r -> r
                        .path("/bookmarks/**")
                        .filters(f -> f.stripPrefix(0)
                                .filter(jwtAuthFilter.apply(new JwtAuthFilter.Config())))
                        .uri("lb://bookmark-service"))
                .build();
    }
}