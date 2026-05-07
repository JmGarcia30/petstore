# Petstore Deployment Guide for Render.com

This guide walks you through deploying the Petstore e-commerce application on Render.com with PostgreSQL database.

## Prerequisites

- GitHub account with repository access
- Render.com account (free tier available)
- Backend repository on GitHub

## Step 1: Prepare PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `petstore-postgres`
   - **Database**: `petstore`
   - **User**: `petstore`
   - **Region**: Choose closest to you
   - **Plan**: Free tier is fine for development
4. Click "Create Database"
5. Once created, copy the **Internal Database URL** (format: `postgresql://user:password@hostname:5432/database`)
6. Keep this URL safe - you'll need it for the backend

## Step 2: Deploy Backend Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Select "Deploy an existing repository" (connect GitHub if needed)
4. Choose your petstore repository
5. Configure:
   - **Name**: `petstore-backend`
   - **Environment**: Docker
   - **Region**: Same as PostgreSQL
   - **Branch**: `main` (or your default branch)
   - **Plan**: Free tier
6. Set **Environment Variables**:
   ```
   SPRING_DATASOURCE_URL=postgresql://<your-postgres-internal-url>
   SPRING_DATASOURCE_USERNAME=petstore
   SPRING_DATASOURCE_PASSWORD=<your-postgres-password>
   SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
   SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
   CORS_ALLOWED_ORIGINS=https://<your-frontend-url>.onrender.com
   ```
7. Leave **Root Directory** empty (or set to `backend` if monorepo)
8. **Build Command**: (leave empty - uses Dockerfile)
9. **Start Command**: (leave empty - uses Dockerfile)
10. Click "Create Web Service"
11. Wait for deployment to complete. Copy your backend URL: `https://petstore-backend.onrender.com`

## Step 3: Deploy Frontend on Render

### Option A: Static Site (Recommended)

1. Go to Render Dashboard → "New +" → "Static Site"
2. Connect GitHub repository
3. Configure:
   - **Name**: `petstore-frontend`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free tier
4. Set **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://petstore-backend.onrender.com/api/v1
   ```
5. Click "Create Static Site"
6. Copy your frontend URL: `https://petstore-frontend.onrender.com`

### Option B: Web Service (if you need Node.js runtime)

1. Go to Render Dashboard → "New +" → "Web Service"
2. Configure similar to backend but:
   - **Environment**: Node
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm run preview`

## Step 4: Update CORS in Backend

1. Go back to your backend service on Render
2. Click "Environment" (in left sidebar)
3. Update `CORS_ALLOWED_ORIGINS` with your frontend URL:
   ```
   https://petstore-frontend.onrender.com
   ```
4. Redeploy by clicking "Manual Deploy" or by pushing a new commit

## Step 5: Test the Deployment

1. Go to your frontend URL: `https://petstore-frontend.onrender.com`
2. Check if products load correctly
3. Try adding items to cart
4. Verify API calls work by opening browser DevTools → Network tab

## Troubleshooting

### Products Not Loading
- Check backend logs: Render Dashboard → Backend Service → Logs
- Verify database connection in logs
- Ensure CORS is configured correctly
- Check frontend console for API errors

### Database Connection Issues
- Verify `SPRING_DATASOURCE_URL` is correct
- Check username/password match PostgreSQL credentials
- Ensure database is running

### CORS Errors
- Update `CORS_ALLOWED_ORIGINS` in backend environment
- Make sure it matches your frontend URL exactly
- Redeploy backend after changes

## Local Development with Docker

To test locally before deploying:

```bash
# Start services with docker-compose
docker-compose up

# Frontend: http://localhost:5174
# Backend: http://localhost:8080
# PostgreSQL: localhost:5432
```

## Database Migrations

Flyway automatically runs migrations from `backend/src/main/resources/db/migration/` on startup. The `V1__init.sql` file creates the schema and seeds initial data.

## Manual Database Access

To access your PostgreSQL database on Render:

1. Use the **External Database URL** from Render PostgreSQL service
2. Connect with a tool like DBeaver, pgAdmin, or psql:
   ```bash
   psql <external-database-url>
   ```
3. To view tables:
   ```sql
   \dt
   SELECT * FROM categories;
   SELECT * FROM pets;
   ```

## Next Steps

- Monitor logs regularly for errors
- Set up automated backups for PostgreSQL
- Consider upgrading to paid plans for production
- Add authentication/authorization for user accounts
- Implement payment processing for orders

## Support

For issues:
- Check Render documentation: https://render.com/docs
- Review Spring Boot logs in Render dashboard
- Verify environment variables are set correctly
