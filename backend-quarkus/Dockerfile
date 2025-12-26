FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the entire Quarkus fast-jar structure
COPY target/quarkus-app/ /app/

EXPOSE 8080

# Run Quarkus the correct way
CMD ["java", "-jar", "/app/quarkus-run.jar"]
