package com.teamcook.tastytieschat.security.jwtutil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.accessTokenExpiration}")
    private long accessTokenExpirationInMs;

    @Value("${jwt.refreshTokenExpiration}")
    private long refreshTokenExpirationInMs;

    private Key jwtSecret;

    @PostConstruct
    public void init() {
        this.jwtSecret = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(jwtSecret).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // exception handle
        }

        return false;
    }

}
