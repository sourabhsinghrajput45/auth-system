package com.auth.user.api;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/me")
public class MeResource {

    @GET
    public Response me(@Context SecurityContext securityContext) {

        if (securityContext.getUserPrincipal() == null) {
            return Response.status(401)
                    .entity("Unauthenticated")
                    .build();
        }

        return Response.ok(
                securityContext.getUserPrincipal().getName()
        ).build();
    }
}
