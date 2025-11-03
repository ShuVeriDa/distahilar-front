# Deployment Guide for DistaHilar Frontend

This guide provides instructions for deploying the DistaHilar frontend Next.js application to production.

## Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun
- Backend API running and accessible
- Environment variables configured

## Environment Variables

Copy the `env.example` file to `.env.local`:

```bash
cp env.example .env.local
```

### Required Environment Variables

| Variable                     | Description                                       | Example                 |
| ---------------------------- | ------------------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_BACKEND_URL`    | Backend API URL                                   | `http://localhost:9555` |
| `NEXT_PUBLIC_WS_BACKEND_URL` | WebSocket Backend URL                             | `http://localhost:9555` |
| `NEXT_PUBLIC_COOKIE_DOMAIN`  | Cookie domain (leave `localhost` for development) | `yourdomain.com`        |
| `NEXT_PUBLIC_COOKIE_SECURE`  | Enable secure cookies (HTTPS)                     | `true` or `false`       |

## Deployment Steps

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Build the Application

```bash
npm run build
# or
yarn build
# or
pnpm build
```

This will create an optimized production build in the `.next` directory.

### 3. Start the Application

#### Development

```bash
npm run dev
```

#### Production

```bash
npm start
```

The application will start on `http://localhost:3000`.

## Production Deployment Options

### Option 1: Node.js Server

Deploy to any Node.js hosting platform:

1. Build the application: `npm run build`
2. Start the server: `npm start`
3. Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start npm --name "distahilar-frontend" -- start
pm2 save
pm2 startup
```

### Option 2: Docker

See [DOCKER.md](./DOCKER.md) for Docker deployment instructions.

### Option 3: Vercel (Recommended)

Vercel is the platform created by the Next.js team:

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository on [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy automatically on every push

**Environment Variables for Vercel:**

- `NEXT_PUBLIC_BACKEND_URL`: Your backend API URL
- `NEXT_PUBLIC_WS_BACKEND_URL`: Your WebSocket URL
- `NEXT_PUBLIC_COOKIE_DOMAIN`: Your domain
- `NEXT_PUBLIC_COOKIE_SECURE`: `true` for production

### Option 4: Static Export (SSG)

For static site generation:

1. Add to `next.config.ts`:
   ```typescript
   output: "export"
   ```
2. Build: `npm run build`
3. Deploy the `out` directory to any static hosting

**Note:** This disables server-side features like API routes and middleware.

## Security Considerations

### 1. Environment Variables

- **Never commit** `.env.local` or `.env` files
- Use `.env.production` for production variables
- Keep `NEXT_PUBLIC_*` variables public (they're exposed to clients)

### 2. HTTPS

Always use HTTPS in production:

- Set `NEXT_PUBLIC_COOKIE_SECURE=true`
- Ensure SSL certificates are valid
- Use trusted certificate authorities

### 3. Cookies

Configure cookies properly:

- Set `NEXT_PUBLIC_COOKIE_DOMAIN` to your domain
- Enable secure cookies in production
- Use `SameSite` attribute appropriately

### 4. CORS

Ensure backend allows requests from your frontend domain.

## Performance Optimization

### 1. Image Optimization

- Use `next/image` component
- Configure `remotePatterns` in `next.config.ts`
- Use appropriate image formats (WebP, AVIF)

### 2. Code Splitting

- Next.js automatically code-splits
- Use dynamic imports for large components
- Lazy load non-critical features

### 3. Caching

- Set proper cache headers
- Use Next.js caching strategies
- Implement browser caching

### 4. Bundle Size

- Analyze bundle: `npm run build -- --analyze`
- Remove unused dependencies
- Use tree-shaking

## Production Checklist

- [ ] All environment variables are set correctly
- [ ] Backend API is accessible from frontend
- [ ] HTTPS is configured
- [ ] Cookies are configured for production
- [ ] Build completes without errors
- [ ] All routes are accessible
- [ ] WebSocket connections work
- [ ] Internationalization works (ru/en/che)
- [ ] Authentication flow works
- [ ] Error handling is tested
- [ ] Performance is optimized
- [ ] SEO meta tags are configured

## Troubleshooting

### Build Errors

```bash
# Clear .next directory
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Try building again
npm run build
```

### WebSocket Connection Issues

- Verify `NEXT_PUBLIC_WS_BACKEND_URL` is correct
- Check backend is accepting WebSocket connections
- Ensure firewall/proxy allows WebSocket traffic
- Check browser console for connection errors

### Cookie Issues

- Verify `NEXT_PUBLIC_COOKIE_DOMAIN` matches your domain
- Check `NEXT_PUBLIC_COOKIE_SECURE` is set correctly
- Ensure cookies aren't blocked by browser
- Test in incognito mode

### API Connection Issues

- Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- Check CORS configuration on backend
- Test with curl or Postman
- Check browser network tab for errors

### Internationalization Not Working

- Ensure locale files exist in `i18n/`
- Check middleware configuration
- Verify routing is correct
- Test all supported languages

## Monitoring

### Application Metrics

- Set up error tracking (Sentry, LogRocket)
- Monitor WebSocket connection health
- Track API response times
- Monitor user authentication success rate

### Performance Monitoring

- Use Vercel Analytics or similar
- Monitor Core Web Vitals
- Track bundle size over time
- Monitor API usage

## Support

For issues or questions:

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)
- [next-intl Documentation](https://next-intl-docs.vercel.app)
