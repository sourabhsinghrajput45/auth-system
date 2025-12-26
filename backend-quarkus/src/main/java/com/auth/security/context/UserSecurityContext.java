package com.auth.security.context;

import com.auth.user.entity.User;
import jakarta.ws.rs.core.SecurityContext;

import java.security.Principal;

public class UserSecurityContext implements SecurityContext {

    private final User user;
    private final SecurityContext delegate;

    public UserSecurityContext(User user, SecurityContext delegate) {
        this.user = user;
        this.delegate = delegate;
    }

    @Override
    public Principal getUserPrincipal() {
        return () -> user.getEmail();
    }

    @Override
    public boolean isUserInRole(String role) {
        return false;
    }

    @Override
    public boolean isSecure() {
        return delegate.isSecure();
    }

    @Override
    public String getAuthenticationScheme() {
        return "Bearer";
    }

    // Optional helper
    public User getUser() {
        return user;
    }
}
