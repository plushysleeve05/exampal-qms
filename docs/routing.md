# SPA Routing Configuration

This document provides information on handling routing in ExamPal QMS, which is a single-page application (SPA).

## Development Environment

In development mode (when running with `npm run dev`), the Vite development server automatically handles SPA routing.

## Production Deployment

When deploying to production, you need to configure your server to handle client-side routing. The application includes configuration files for various hosting platforms:

### Netlify

For Netlify hosting, the `public/_redirects` file is already configured to handle SPA routing:

```
/* /index.html 200
```

### Apache Server

If deploying to an Apache server, use the included `.htaccess` file in the `public` directory:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Vercel

For Vercel hosting, the `vercel.json` file configures the necessary rewrites:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Other Hosting Platforms

For other hosting platforms like Heroku, the `static.json` file can be used:

```json
{
  "root": "dist",
  "clean_urls": true,
  "routes": {
    "/**": "index.html"
  }
}
```

## Common Issues

If you experience 404 errors when refreshing the page or accessing deep links directly:

1. Ensure your server is properly configured to handle SPA routing
2. Check that all routes in the application match the route definitions in `App.tsx`
3. Verify that URL updates in the code use the correct route format

## URL Structure

The application uses the following URL structure:
- `/:examType/:subject` - Subject page
- `/:examType/:subject/questions` - Questions page
- `/:examType/:subject/questions/add/:section` - Add question page

When changing subjects via the UI, the URL is automatically updated to reflect the new subject.