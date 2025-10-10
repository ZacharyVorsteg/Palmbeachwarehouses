# Palm Beach Warehouses - Trusenda CRM Integration

This website integrates with your Trusenda CRM to automatically capture leads from palmbeachwarehouses.com.

## Features

- ✅ Beautiful, modern landing page with industrial space form
- ✅ Automatic lead submission to Trusenda CRM
- ✅ Real-time form validation
- ✅ Success/error handling
- ✅ Mobile responsive design
- ✅ No Trusenda branding on the frontend (backend integration only)

## How It Works

1. Visitors fill out the form on palmbeachwarehouses.com
2. JavaScript integration fetches your Trusenda tenant ID using your slug (`zacharyvorsteg`)
3. Form data is automatically submitted to your Trusenda CRM via API
4. Leads appear in your Trusenda dashboard instantly

## Files

- `index.html` - Main landing page with form
- `styles.css` - Custom styling for the site
- `crm-integration.js` - Trusenda CRM integration logic
- `netlify.toml` - Deployment configuration for Netlify
- `assets/` - Images and assets folder

## Setup & Deployment

### Option 1: Deploy to Netlify (Recommended)

1. Push this code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Connect to Netlify:
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Choose GitHub and select your repository
   - Build settings are already configured in `netlify.toml`
   - Click "Deploy site"

3. Set up custom domain:
   - In Netlify: Site settings > Domain management
   - Add custom domain: `palmbeachwarehouses.com`
   - Follow DNS instructions to point your domain to Netlify

### Option 2: Deploy Anywhere

This is a static site with no build process required. You can:
- Upload to any hosting provider (AWS S3, Vercel, GitHub Pages, etc.)
- Simply serve the HTML, CSS, and JS files

## Customization

### Update Trusenda Slug
If you need to change the Trusenda form slug, edit `crm-integration.js`:

```javascript
const CONFIG = {
    TRUSENDA_SLUG: 'zacharyvorsteg', // Change this
    TRUSENDA_API_URL: 'https://trusenda.com/.netlify/functions',
};
```

### Local Development

For local testing:
1. Update the API URL in `crm-integration.js` to point to your local Trusenda instance:
   ```javascript
   TRUSENDA_API_URL: 'http://localhost:8888/.netlify/functions'
   ```

2. Serve with any local web server:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve
   
   # VS Code Live Server extension
   ```

3. Open http://localhost:8000 in your browser

### Styling

All styles are in `styles.css`. The design uses CSS variables for easy theming:

```css
:root {
    --primary-blue: #1a73e8;
    --primary-blue-dark: #1557b0;
    --success-green: #28a745;
    /* etc. */
}
```

### Add Your Logo

Replace the placeholder logo:
1. Add your logo image to `assets/logo.png`
2. The logo will automatically appear in the header

## Testing

1. Fill out the form with test data
2. Check your Trusenda CRM dashboard
3. The lead should appear with:
   - Source: `palmbeachwarehouses.com`
   - All form fields mapped correctly
   - Notes field containing additional details

## Troubleshooting

### Leads Not Appearing in CRM

1. Check browser console for errors (F12 > Console)
2. Verify your Trusenda slug is correct: `zacharyvorsteg`
3. Make sure your Trusenda CRM is live at https://trusenda.com
4. Check network tab to see API requests

### Form Not Submitting

1. Check that `crm-integration.js` is loaded
2. Verify the tenant ID is being fetched (check console logs)
3. Ensure all required fields are filled

### API Errors

- **401 Unauthorized**: Invalid slug or tenant not found
- **402 Lead limit reached**: Your CRM has reached its lead limit
- **500 Server error**: Check Trusenda CRM logs

## Support

If you encounter issues:
1. Check the browser console for detailed error logs
2. All API calls are logged with emoji prefixes (🚀, ✅, ❌)
3. Contact Trusenda support with error details

## License

Proprietary - Palm Beach Warehouses / Trusenda CRM

