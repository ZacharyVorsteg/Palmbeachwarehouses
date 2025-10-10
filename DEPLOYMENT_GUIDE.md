# Deployment Guide - Palm Beach Warehouses

## 🎉 What's Been Set Up

Your Palm Beach Warehouses website is now ready to deploy! Here's what's been configured:

✅ **Full HTML landing page** with industrial space form  
✅ **Trusenda CRM integration** - All form submissions go directly to your CRM  
✅ **Git repository initialized** - Ready to push to GitHub  
✅ **Netlify deployment config** - One-click deployment ready  
✅ **Mobile responsive design** - Works perfectly on all devices  
✅ **No visible Trusenda branding** - Backend integration only  

## 🚀 Quick Deployment (3 Steps)

### Step 1: Push to GitHub

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Repository name: `palmbeachwarehouses`
   - Keep it private or public (your choice)
   - **DO NOT** initialize with README (we already have one)
   - Click "Create repository"

2. Push your code:
   ```bash
   cd "/Users/zachthomas/Desktop/CRM APP/palmbeachwarehouses"
   
   # Add your GitHub repository (replace with your actual URL)
   git remote add origin https://github.com/YOUR_USERNAME/palmbeachwarehouses.git
   
   # Push to GitHub
   git push -u origin main
   ```

### Step 2: Deploy to Netlify

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select your **palmbeachwarehouses** repository
5. Build settings are already configured - just click **"Deploy site"**
6. Wait ~30 seconds for deployment to complete ✨

### Step 3: Connect Your Domain

1. In Netlify dashboard, go to **Site settings** → **Domain management**
2. Click **"Add domain"**
3. Enter: `palmbeachwarehouses.com`
4. Netlify will provide DNS records to configure

**Update your domain DNS:**
- Log into your domain registrar (GoDaddy, Namecheap, etc.)
- Add the DNS records Netlify provides
- Wait 5-60 minutes for DNS propagation

## 🧪 Testing Before Going Live

### Test Locally First

1. Open the project in your browser:
   ```bash
   cd "/Users/zachthomas/Desktop/CRM APP/palmbeachwarehouses"
   
   # Option 1: Python
   python3 -m http.server 8000
   
   # Option 2: npx serve
   npx serve
   ```

2. Open http://localhost:8000 in your browser
3. Fill out the form with test data
4. Check your Trusenda CRM dashboard - the lead should appear!

### Verify Integration

**What to check:**
- ✅ Form submits without errors
- ✅ Success message displays after submission
- ✅ Lead appears in your Trusenda CRM dashboard
- ✅ Lead has source: `palmbeachwarehouses.com`
- ✅ All form fields are captured correctly

**Check browser console:**
- Open DevTools (F12)
- Look for console logs with emojis:
  - 🚀 = Integration initializing
  - ✅ = Success
  - ❌ = Errors
  - 📡 = API calls

## 🎨 Customization

### Add Your Logo

1. Add your logo file to `assets/logo.png`
2. Recommended size: 200x50px, transparent background
3. Commit and push:
   ```bash
   git add assets/logo.png
   git commit -m "Add company logo"
   git push
   ```

### Update Content

Edit `index.html` to customize:
- Phone number (currently 561-718-6725)
- Company name and tagline
- Form fields
- Call-to-action buttons
- Features and benefits

### Change Colors/Styling

Edit `styles.css` - all colors use CSS variables:

```css
:root {
    --primary-blue: #1a73e8;        /* Change primary color */
    --success-green: #28a745;       /* Change button color */
    --dark-bg: #1a1f33;            /* Change header background */
}
```

### Modify Form Fields

To add/remove form fields:
1. Edit the HTML in `index.html`
2. Update the data mapping in `crm-integration.js` → `collectFormData()`
3. Update the notes formatting in `buildNotesField()`

## 🔧 Advanced Configuration

### Environment-Specific APIs

For development vs production:

```javascript
// In crm-integration.js
const CONFIG = {
    TRUSENDA_SLUG: 'zacharyvorsteg',
    TRUSENDA_API_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:8888/.netlify/functions'  // Local development
        : 'https://trusenda.com/.netlify/functions',   // Production
};
```

### Add Analytics

Add Google Analytics to `index.html`:

```html
<head>
    <!-- ... existing tags ... -->
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    </script>
</head>
```

The CRM integration already fires a conversion event:
```javascript
gtag('event', 'lead_submission', {
    'event_category': 'form',
    'event_label': 'palm_beach_warehouses'
});
```

### Add Facebook Pixel

```html
<head>
    <!-- Facebook Pixel Code -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', 'YOUR_PIXEL_ID');
      fbq('track', 'PageView');
    </script>
</head>
```

## 🐛 Troubleshooting

### Leads Not Showing Up in CRM

**Problem:** Form submits but leads don't appear in Trusenda

**Solutions:**
1. Check browser console for errors (F12 → Console)
2. Verify tenant ID is fetched successfully (look for ✅ log)
3. Confirm your Trusenda slug is correct: `zacharyvorsteg`
4. Check if you've hit your CRM lead limit
5. Try submitting directly to https://trusenda.com/submit/zacharyvorsteg to verify it works

### API Errors

**401 Unauthorized**
- Your Trusenda slug may be incorrect
- Check `crm-integration.js` CONFIG.TRUSENDA_SLUG

**402 Lead Limit Reached**
- Your Trusenda account has reached its lead limit
- Upgrade your plan or clear old leads

**500 Server Error**
- Check Trusenda CRM is online
- Try again in a few minutes
- Check Netlify function logs in your Trusenda deployment

### Form Not Submitting

**Problem:** Submit button doesn't do anything

**Solutions:**
1. Check that `crm-integration.js` is loaded (view page source)
2. Check for JavaScript errors in console
3. Ensure all required fields are filled
4. Try in a different browser
5. Clear browser cache

### CORS Errors

If you see CORS errors in console:
- This shouldn't happen since Trusenda API has CORS enabled
- Make sure you're using HTTPS (not HTTP) in production
- Check that `TRUSENDA_API_URL` is correct in `crm-integration.js`

## 📊 Monitoring

### Check Deployment Status

**Netlify:**
- Dashboard: https://app.netlify.com
- View build logs
- See deployment history
- Monitor site analytics

### Check CRM Status

**Trusenda Dashboard:**
- https://trusenda.com
- View incoming leads
- Check lead source = `palmbeachwarehouses.com`
- Monitor lead quality and volume

### Browser Console Logs

The integration provides detailed logging:
```
🚀 Initializing Trusenda CRM Integration...
📡 Fetching tenant info for slug: zacharyvorsteg
✅ Tenant ID retrieved successfully: [TENANT_ID]
✅ Form submission handler attached
📝 Form submission started...
📦 Submitting lead data: {...}
✅ Lead submitted successfully: {...}
```

## 🔄 Making Updates

After initial deployment, making updates is easy:

```bash
cd "/Users/zachthomas/Desktop/CRM APP/palmbeachwarehouses"

# Make your changes to HTML, CSS, or JS

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push

# Netlify will automatically rebuild and deploy! 🚀
```

## 🎯 Next Steps

1. ✅ **Test the integration** - Submit a test lead and verify it appears in Trusenda
2. ✅ **Add your logo** - Upload to assets/logo.png
3. ✅ **Push to GitHub** - Follow Step 1 above
4. ✅ **Deploy to Netlify** - Follow Step 2 above
5. ✅ **Connect domain** - Point palmbeachwarehouses.com to Netlify
6. ✅ **Test live site** - Fill out form and verify CRM integration works
7. 📈 **Set up analytics** - Add Google Analytics and Facebook Pixel if desired
8. 🚀 **Go live!** - Start driving traffic to your site

## 💡 Pro Tips

- **Test in incognito mode** to see the experience as a new visitor
- **Submit test leads** with different data to verify all fields work
- **Check mobile responsiveness** on actual devices
- **Monitor your CRM daily** for new leads
- **Respond quickly** to leads (ideally within 1 hour)
- **Set up email notifications** in Trusenda for new leads
- **Track conversion rates** to optimize your form

## 📞 Support

If you need help:
1. Check this guide first
2. Review browser console logs
3. Check Netlify build logs
4. Review Trusenda CRM logs
5. Test with different browsers

## 🎊 You're All Set!

Your website is ready to capture leads and send them directly to your Trusenda CRM. The integration is seamless, secure, and will scale with your business.

**Time to deploy:** Follow the 3 steps above and you'll be live in under 10 minutes! 🚀

