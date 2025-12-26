package com.auth.security.token.filter;

import com.auth.security.context.UserSecurityContext;
import com.auth.security.token.entity.AccessToken;
import com.auth.security.token.repository.AccessTokenRepository;
import com.auth.user.entity.User;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

import java.time.Instant;

@Provider
@Priority(Priorities.AUTHENTICATION)
public class AccessTokenFilter implements ContainerRequestFilter {

    @Inject
    AccessTokenRepository tokenRepository;

    @Override
    public void filter(ContainerRequestContext requestContext) {

        String path = requestContext.getUriInfo().getPath();

        // ✅ Allow auth endpoints
        if (path.startsWith("auth") || path.startsWith("/auth")) {
            return;
        }

        String authHeader =
                requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            abort(requestContext, "Missing access token");
            return;
        }

        String tokenValue = authHeader.substring("Bearer ".length());

        AccessToken token = tokenRepository
                .find("token = ?1 and revoked = false", tokenValue)
                .firstResult();

        if (token == null) {
            abort(requestContext, "Invalid access token");
            return;
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            token.setRevoked(true);
            abort(requestContext, "Access token expired");
            return;
        }

        User user = token.getUser();

        // ✅ THIS IS THE KEY PART
        requestContext.setSecurityContext(
                new UserSecurityContext(
                        user,
                        requestContext.getSecurityContext()
                )
        );
    }

    private void abort(ContainerRequestContext ctx, String message) {
        ctx.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                        .entity(message)
                        .build()
        );
    }
}
