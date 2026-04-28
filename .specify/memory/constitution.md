<!--
Sync Impact Report

Version change: unknown -> 0.1.0
Modified principles: placeholder template -> project-specific principles (see list below)
Added sections: Technology & Deployment Constraints, Development Workflow
Removed sections: none (template placeholders replaced)
Templates requiring updates: ⚠ pending - .specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md
Follow-up TODOs: RATIFICATION_DATE unknown (TODO(RATIFICATION_DATE): determine original adoption date)
-->

# Petstore Constitution

## Core Principles

### 1. Product-First, API-Driven
All backend functionality MUST be expressed as stable, well-documented HTTP/REST or GraphQL APIs so that frontend, mobile, and third-party integrations can consume features reliably. API contracts are the primary integration surface and MUST be versioned when changing in a breaking way.

### 2. Technology Pragmatism (Stack Lock)
The project standardizes on the following stack: Java Spring Boot for backend services, PostgreSQL for primary data persistence, React with Tailwind CSS and MUI for the frontend. Deviations require explicit approval and a migration plan.

### 3. Test-First Discipline
Automated testing is mandatory: unit tests for business logic, integration tests for service-database interactions, and end-to-end smoke tests for critical flows (product listing, cart, checkout). New features MUST include tests demonstrating expected behaviour before review.

### 4. Security & Data Protection
Handle user data (including PII and payment-related metadata) with least-privilege access, encrypted at rest and in transit. Use parameterized queries/ORM migrations to prevent injection. Secrets MUST be stored in the environment or secret manager—not in source control.

### 5. Observability, Simplicity & Cost-Awareness
Instrumentation (structured logging and basic metrics) MUST be present for service-critical paths. Design for simplicity and free-tier deployment constraints (Render free plans): optimize for resource efficiency, small container images, and minimal background processing where possible.

## Technology & Deployment Constraints

This project targets a deployable e-commerce application that sells pets (dogs, cats, birds, fishes) with the following constraints and defaults:
- Backend: Java Spring Boot, packaged as a single service per logical domain; follow 12-factor app practices.
- Database: PostgreSQL (hosted on Render or an approved free-tier provider). Database schema changes MUST be managed via migration tooling (Flyway or Liquibase).
- Frontend: React, styled with Tailwind CSS and componentized with MUI. Frontend is a static bundle deployable to Render static web services.
- CI/CD: Prefer GitHub Actions for builds and tests; deployment targets Render webservice and static site.
- Free-tier considerations: Keep resource usage low (small JVM heap, build-time optimizations) and prefer serverless/static where feasible.

## Development Workflow

- Branching: Use short-lived feature branches; name them `feature/<short-description>`.
- Reviews: All changes require a PR with at least one approving reviewer and passing test suite.
- Quality gates: Tests MUST pass; critical flows (product catalog, cart, checkout) MUST have integration tests that run in CI.
- Database migrations: Add migration files to repository and include a migration step in the service startup or deployment pipeline.
- Secrets & config: Use environment variables; document required env vars in the repo README.

## Governance

The constitution defines non-negotiable project rules. Amendments MUST be proposed in a PR that includes: rationale, migration plan for affected systems, and a test plan. Amendments are accepted by majority approval from maintainers.

- Compliance checks: CI should run a lightweight checklist to verify required env vars, presence of migration files, and test coverage for new features.
- Versioning policy: Semantic versioning for constitution docs. MAJOR changes: remove or redefine principles. MINOR: add principles or materially expand guidance. PATCH: wording clarifications.

**Version**: 0.1.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2026-04-28

