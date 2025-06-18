# SEO & Social Media Images Guide

This app now supports beautiful social media sharing with dynamic Open Graph images. Here's what you need to know:

## Required Images

### Open Graph Images (Auto-Generated)
- The app automatically generates Open Graph images via `/api/og`
- Main page: `/api/og?type=brand`
- Quote sharing: `/api/og?start=...&completion=...&mood=...`

### Static Images Needed

Create these images and place them in the `public/` folder:

1. **og-image.png** (1200x630px)
   - Main Open Graph image for the homepage
   - Should feature the "Unfinished Sentences" branding
   - Background: #FAF8F5 with rose accent #D9A5B3

2. **og-image-square.png** (1080x1080px)
   - Square version for platforms that prefer square images
   - Same design as og-image.png but in square format

3. **screenshot-desktop.png** (1280x720px)
   - Desktop screenshot for PWA manifest
   - Shows the main interface

4. **screenshot-mobile.png** (390x844px)
   - Mobile screenshot for PWA manifest
   - Shows the mobile interface

## Image Creation Tips

### Brand Colors
- Background: `#FAF8F5` (cream)
- Primary: `#2D3748` (dark gray)
- Accent: `#D9A5B3` (rose)
- Text: `#666666` (medium gray)

### Typography
- Main title: Light serif font
- "Sentences" should be italic and in rose color
- Include tagline: "Complete the Unsaid"

### Design Elements
- Subtle dot pattern background
- Elegant divider lines
- Plenty of white space
- Serif fonts for elegance

## Dynamic OG Images

The app automatically generates beautiful Open Graph images for:

### Quote Cards
- Mood-based color schemes
- Proper typography and spacing
- Quote icon and branding
- Responsive text sizing

### Brand Cards
- Clean, elegant design
- Main branding and tagline
- Consistent with app design

## Testing

Test your social media sharing with:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## SEO Features Added

✅ **Metadata & Open Graph**
- Dynamic metadata for shared quotes
- Proper Open Graph images
- Twitter Card support
- Rich snippets with structured data

✅ **Technical SEO**
- Sitemap.xml
- Robots.txt
- Canonical URLs
- Meta descriptions

✅ **Performance**
- Font preloading
- Optimized images
- Proper meta tags

✅ **PWA Features**
- Enhanced manifest.json
- App shortcuts
- Screenshots
- Proper icons

## Social Media Optimization

The app now provides:
- **Shareable URLs** with embedded quote data
- **Beautiful previews** on all platforms
- **Direct sharing** to Twitter, Facebook, LinkedIn
- **Download options** for quote images
- **Copy to clipboard** functionality

## Implementation Notes

- All images are generated at runtime using Next.js ImageResponse
- Fallback static images are used for the main page
- URLs are properly encoded for social sharing
- Metadata is dynamically generated based on content 