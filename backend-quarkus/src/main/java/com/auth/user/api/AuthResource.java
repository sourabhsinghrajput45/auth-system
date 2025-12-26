package com.auth.user.api;

import com.auth.user.entity.User;
import com.auth.user.service.UserService;

import com.auth.security.token.service.AccessTokenService;
import com.auth.security.token.entity.AccessToken;
import com.auth.security.token.service.RefreshTokenService;
import com.auth.security.token.entity.RefreshToken;
import org.eclipse.microprofile.context.ManagedExecutor;

import com.auth.user.verification.entity.EmailVerificationToken;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    ManagedExecutor executor;

    @Inject
    UserService userService;

    @Inject
    com.auth.user.verification.service.EmailVerificationService emailVerificationService;

    @Inject
    AccessTokenService accessTokenService;


    @Inject
    RefreshTokenService refreshTokenService;

    @POST
    @Path("/signup")
    public Response signup(SignupRequest request) {

        if (request.email == null || request.password == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "Email and password are required"))
                    .build();
        }

        User user = userService.createUser(
                request.email,
                request.password
        );

        EmailVerificationToken token =
                emailVerificationService.createToken(user);

        // ✅ async AFTER transaction
        executor.execute(() ->
                emailVerificationService.sendVerificationEmail(
                        user.getEmail(),
                        token.getToken()
                )
        );

        return Response.status(Response.Status.CREATED)
                .entity(Map.of(
                        "message", "Signup successful. Please verify your email."
                ))
                .build();
    }


    @GET
    @Path("/verify")
    public Response verifyEmail(@QueryParam("token") String token) {

        if (token == null || token.isBlank()) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity("Verification token is required")
                    .build();
        }

        emailVerificationService.verifyEmail(token);

        return Response
                .ok("Your email is verified. You can access the portal")
                .build();
    }

    @POST
    @Path("/login")
    public Response login(LoginRequest request) {

        if (request.email == null || request.password == null) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity("Email and password are required")
                    .build();
        }

        var user = userService
                .findByEmail(request.email)
                .orElseThrow(() ->
                        new IllegalStateException("Invalid email or password")
                );

        boolean passwordMatches =
                com.auth.security.PasswordHasher.matches(
                        request.password,
                        user.getPasswordHash()
                );

        if (!passwordMatches) {
            throw new IllegalStateException("Invalid email or password");
        }

        if (!user.isEmailVerified()) {
            return Response
                    .ok("You need to validate your email to access the portal")
                    .build();
        }

        AccessToken accessToken = accessTokenService.issueToken(user);
        RefreshToken refreshToken = refreshTokenService.issue(user);

        return Response.ok(Map.of(
                "accessToken", accessToken.getToken(),
                "accessTokenExpiresAt", accessToken.getExpiresAt(),
                "refreshToken", refreshToken.getToken(),
                "refreshTokenExpiresAt", refreshToken.getExpiresAt(),
                "message", "Your email is validated. You can access the portal"
        )).build();

    }

    @POST
    @Path("/status")
    public Response authStatus(AuthStatusRequest request) {

        if (request == null || request.refreshToken == null || request.refreshToken.isBlank()) {
            return Response.ok(
                    Map.of(
                            "emailVerified", false
                    )
            ).build();
        }

        // 1️⃣ Validate refresh token
        RefreshToken refreshToken = refreshTokenService
                .findValid(request.refreshToken)
                .orElse(null);

        if (refreshToken == null) {
            return Response.ok(
                    Map.of(
                            "emailVerified", false
                    )
            ).build();
        }

        // 2️⃣ Load user
        User user = refreshToken.getUser();

        // 3️⃣ Return verification state (NO AUTH REQUIRED)
        return Response.ok(
                Map.of(
                        "email", user.getEmail(),
                        "emailVerified", user.isEmailVerified()
                )
        ).build();
    }


    @POST
    @Path("/logout")
    public Response logout() {

        // No server-side state to clear (stateless)
        return Response
                .ok("Logged out successfully")
                .build();
    }


}
