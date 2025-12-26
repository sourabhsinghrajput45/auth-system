package com.auth.security.token.service;

import com.auth.security.token.entity.AccessToken;
import com.auth.security.token.repository.AccessTokenRepository;
import com.auth.user.entity.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

@ApplicationScoped
public class AccessTokenService {

    private static final SecureRandom RANDOM = new SecureRandom();

    @Inject
    AccessTokenRepository tokenRepository;

    /**
     * Create a new opaque access token for a user.
     * Any existing active tokens for this user are revoked.
     */
    @Transactional
    public AccessToken issueToken(User user) {

        // revoke existing active tokens (simple rotation)
        tokenRepository.find("user = ?1 and revoked = false", user)
                .stream()
                .forEach(t -> t.setRevoked(true));

        Instant now = Instant.now();

        AccessToken token = new AccessToken();
        token.setUser(user);
        token.setToken(generateTokenValue());
        token.setCreatedAt(now);                      // ← THIS WAS MISSING
        token.setExpiresAt(now.plus(15, ChronoUnit.MINUTES));
        token.setRevoked(false);

        tokenRepository.persist(token);
        return token;
    }


    private String generateTokenValue() {
        byte[] randomBytes = new byte[32];
        RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }
}
