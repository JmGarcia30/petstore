# Multi-stage build for Spring Boot application
FROM maven:3.9-eclipse-temurin-17 as builder

WORKDIR /app

# Copy pom.xml and source code
COPY . .

# Build the application
RUN mvn clean package -DskipTests

# Final stage - runtime image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the JAR from builder stage
COPY --from=builder /app/target/petstore-backend-*.jar app.jar

# Expose port
EXPOSE 8080

# Set environment variables for database
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/petstore
ENV SPRING_DATASOURCE_USERNAME=petstore
ENV SPRING_DATASOURCE_PASSWORD=petstore123
ENV SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
ENV SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
ENV CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,https://petstore-frontend.onrender.com

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/pets?page=0&pageSize=5 || exit 1

# Run the application
CMD ["java", "-Dserver.port=8080", "-jar", "app.jar"]
