# Docker Deployment Guide for Frontend

This guide explains how to deploy the DistaHilar frontend using Docker.

## Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed

## Quick Start

### Using Docker Compose (Recommended)

1. **Create environment file**:

   ```bash
   cp env.example .env.local
   # Edit .env.local with your production values
   ```

2. **Start the application**:

   ```bash
   docker-compose up -d
   ```

3. **View logs**:

   ```bash
   docker-compose logs -f frontend
   ```

4. **Stop the application**:
   ```bash
   docker-compose down
   ```

### Using Docker only

1. **Build the image**:

   ```bash
   docker build -t distanhilar-frontend .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     --name distanhilar-frontend \
     -p 3000:3000 \
     --env-file .env.local \
     distanhilar-frontend
   ```

## Docker Configuration

The `Dockerfile` uses multi-stage builds:

- **Stage 1 (deps)**: Install dependencies
- **Stage 2 (builder)**: Build Next.js application
- **Stage 3 (runner)**: Production runtime with minimal image

## Environment Variables

For Docker Compose, update `docker-compose.yml`:

```yaml
frontend:
  environment:
    NEXT_PUBLIC_BACKEND_URL: https://api.yourdomain.com
    NEXT_PUBLIC_WS_BACKEND_URL: wss://api.yourdomain.com
    NEXT_PUBLIC_COOKIE_DOMAIN: yourdomain.com
    NEXT_PUBLIC_COOKIE_SECURE: "true"
```

Or use environment file:

```yaml
frontend:
  env_file:
    - .env.local
```

## Useful Docker Commands

### View logs

```bash
# Follow logs
docker-compose logs -f frontend

# View recent logs
docker-compose logs --tail=100 frontend
```

### Execute commands in container

```bash
# Access shell
docker-compose exec frontend sh

# Check Node version
docker-compose exec frontend node --version
```

### Restart services

```bash
# Restart
docker-compose restart

# Rebuild and restart
docker-compose up -d --build
```

### Clean up

```bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## Production Deployment

### 1. Security Hardening

Create production `.env.local`:

```bash
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_BACKEND_URL=wss://api.yourdomain.com
NEXT_PUBLIC_COOKIE_DOMAIN=yourdomain.com
NEXT_PUBLIC_COOKIE_SECURE=true
```

### 2. Reverse Proxy (Nginx)

Add nginx service to `docker-compose.yml`:

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
    - ./ssl:/etc/nginx/ssl
  depends_on:
    - frontend
  networks:
    - distanhilar-network
```

Example `nginx.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/webpack-hmr {
        proxy_pass http://frontend:3000/_next/webpack-hmr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

### 3. SSL/TLS Certificates

Use Let's Encrypt with certbot:

```bash
certbot certonly --standalone -d yourdomain.com
```

### 4. Resource Limits

Add resource limits:

```yaml
frontend:
  deploy:
    resources:
      limits:
        cpus: "1"
        memory: 1G
      reservations:
        cpus: "0.5"
        memory: 512M
```

### 5. Health Checks

Add health check:

```yaml
frontend:
  healthcheck:
    test:
      [
        "CMD",
        "wget",
        "--quiet",
        "--tries=1",
        "--spider",
        "http://localhost:3000/api/health",
      ]
    interval: 30s
    timeout: 3s
    retries: 3
    start_period: 40s
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs frontend

# Check port availability
netstat -tuln | grep 3000

# Verify environment variables
docker-compose config
```

### Build failures

```bash
# Clean build cache
docker-compose build --no-cache

# Check disk space
docker system df

# Prune unused images
docker system prune
```

### Environment variable issues

```bash
# Check environment variables in container
docker-compose exec frontend printenv

# Verify .env.local file
cat .env.local
```

### WebSocket connection issues

- Verify `NEXT_PUBLIC_WS_BACKEND_URL` is correct
- Check nginx proxy configuration for WebSocket support
- Ensure backend accepts WebSocket connections

## Development with Docker

For development with hot reload, add to `docker-compose.yml`:

```yaml
frontend:
  volumes:
    - .:/app
    - /app/node_modules
    - /app/.next
  command: npm run dev
  environment:
    NODE_ENV: development
```

Or use override file:

```bash
# docker-compose.override.yml
version: '3.8'
services:
  frontend:
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
```

## Multi-Architecture Builds

For AMD64 and ARM64:

```bash
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 -t distanhilar-frontend --push .
```

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Build and Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build Docker image
        run: docker build -t distanhilar-frontend .

      - name: Push to registry
        run: |
          docker tag distanhilar-frontend yourregistry/distanhilar-frontend:latest
          docker push yourregistry/distanhilar-frontend:latest

      - name: Deploy to server
        run: |
          ssh user@server "docker pull yourregistry/distanhilar-frontend:latest"
          ssh user@server "docker-compose up -d"
```

## Monitoring

### Logs

```bash
# Follow all logs
docker-compose logs -f

# Filter logs
docker-compose logs -f frontend | grep ERROR
```

### Metrics

- Monitor container resource usage: `docker stats`
- Check disk usage: `docker system df`
- View container details: `docker inspect`

## Advanced Configuration

### Standalone Output

The Dockerfile uses Next.js standalone output for optimal size and performance.

### Image Optimization

- Multi-stage builds reduce final image size
- Alpine Linux for minimal footprint
- Proper layer caching for faster rebuilds

### Security Features

- Non-root user (`nextjs:nodejs`)
- Minimal attack surface with Alpine
- No unnecessary packages

## Support

For Docker-specific issues:

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose)
- [Next.js Docker Documentation](https://nextjs.org/docs/app/building-your-application/deploying/docker)
