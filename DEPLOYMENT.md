# Deployment Guide

## Environment Configuration

To deploy this application to production, you need to configure the API URL.

### Frontend Configuration

1. Create a `.env` file in the root directory with your production API URL:

```bash
# For production, set this to your actual backend URL
VITE_API_URL=https://your-production-api.com
```

2. If you don't set `VITE_API_URL`, the app will use the default production URL defined in `src/config/api.ts`.

### Backend Configuration

1. Make sure your backend server is running and accessible at the URL you specified in `VITE_API_URL`.

2. The backend should be configured to handle CORS requests from your frontend domain.

### Development vs Production

- **Development**: Uses `http://localhost:5001` automatically
- **Production**: Uses `VITE_API_URL` environment variable or falls back to the default production URL

### Building for Production

```bash
# Install dependencies
npm install

# Build the application
npm run build

# The built files will be in the `dist` directory
```

### Environment Variables

The following environment variables can be configured:

- `VITE_API_URL`: Your production backend API URL
- `VITE_APP_NAME`: Application name (optional)
- `VITE_STRIPE_PUBLIC_KEY`: Stripe public key for payments (optional)

### Troubleshooting

If you see `ERR_CONNECTION_REFUSED` errors in production:

1. Check that your backend server is running
2. Verify the `VITE_API_URL` is correct
3. Ensure CORS is properly configured on your backend
4. Check that your backend is accessible from your frontend domain 