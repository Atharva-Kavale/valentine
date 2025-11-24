# 💖 Valentine's Love Box

> *"Every great love story deserves to be told in code."*

A romantic Angular web application that turns love into an interactive experience. Think of it as a digital love letter that unfolds over time, revealing heartfelt messages and cherished memories through an elegant, timed unlock mechanism.

## ✨ What Makes This Special?

This isn't just another web app—it's a journey through emotions, built with care and wrapped in code. Each "love box" unlocks at specific intervals, creating anticipation and surprise, just like the butterflies of new love.

### 🎁 Features

- **🔐 Time-Locked Love Notes**: Nine beautiful boxes that unlock progressively, each revealing a heartfelt reason why you're loved
- **📸 Photo Gallery**: A stunning gallery showcasing your favorite moments together (with privacy-first architecture)
- **⏱️ Real-time Countdown**: Watch as each box becomes ready to open, building the excitement
- **💕 Heart Animations**: Delightful floating hearts that appear when viewing special messages
- **🎨 Beautiful UI**: Crafted with Tailwind CSS for a modern, responsive design
- **🔒 Privacy-First**: Your personal photos and messages stay private—never exposed in public repos

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Open your browser to http://localhost:4200
```

## 🎯 How It Works

### The Love Box Experience

1. **Landing Page**: A welcome screen with a countdown to the first unlockable box
2. **Progressive Unlocks**: Each box unlocks after a set time interval from the previous one
3. **Reveal Moments**: Click on an unlocked box to reveal a heartfelt message and photo
4. **Gallery Mode**: Browse through all your shared memories in a beautiful lightbox gallery

### 🧠 Technical Magic

```
🏗️ Built with Angular 19 (Standalone Components)
🎨 Styled with Tailwind CSS 4
💾 Local Storage for persistence
⚡ OnPush Change Detection for performance
🎭 Dynamic animations with pure CSS
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── header/              # Navigation header
│   ├── pages/
│   │   ├── home/                # Main page with love boxes
│   │   ├── reason/              # Individual reason display
│   │   └── gallery/             # Photo gallery with lightbox
│   ├── services/
│   │   ├── reason.service.ts    # Manages love notes & unlocking
│   │   ├── gallery.service.ts   # Handles photo management
│   │   ├── audio.service.ts     # Background music (optional)
│   │   └── cursor.service.ts    # Custom cursor effects
│   └── models/
│       ├── reason.ts            # Love note model
│       └── heart.ts             # Heart animation model
```

## 🔐 Privacy & Security

**Important**: This app is designed with privacy in mind. Your personal photos are never committed to Git!

### Recommended Setup for Private Photos:

1. **Option A: Cloud CDN** (Easiest)
   - Upload photos to [Cloudinary](https://cloudinary.com) or [Imgur](https://imgur.com)
   - Add URLs to [gallery.service.ts](src/app/service/gallery.service.ts)
   - Your images stay private, load fast, and work everywhere

2. **Option B: Git-Ignored Assets**
   - Place photos in `/src/assets/private/` (already in `.gitignore`)
   - Use build scripts to encode/deploy
   - Perfect for self-hosting

[See detailed privacy guide here](#keeping-photos-private)

## 🎨 Customization

### Adding Your Own Messages

Edit [reason.service.ts](src/app/service/reason.service.ts):

```typescript
private readonly reasons: Reason[] = [
  {
    id: 1,
    text: 'Your personalized love message here 💕',
    image: 'your-image-url-or-path.jpg',
  },
  // Add more reasons...
];
```

### Adjusting Unlock Timers

Modify [local-storage.service.ts](src/app/service/local-storage.service.ts) to change unlock intervals (default: progressive unlock system).

### Theme Customization

The app uses Tailwind CSS—customize colors in [tailwind.config.js](tailwind.config.js) or update component styles.

## 🛠️ Build & Deploy

### Build for Production

```bash
npm run build
```

Output goes to `dist/love-website/browser/`

### Deploy Options

**GitHub Pages:**
```bash
npm run deploy
```

**Netlify/Vercel:**
- Connect your repo
- Build command: `npm run build`
- Publish directory: `dist/love-website/browser`

**Manual Hosting:**
Upload the `dist/` folder to any static hosting service.

## 🎵 Optional Features

### Background Music

Uncomment audio code in components to add romantic background music (recommended: royalty-free tracks).

### Custom Cursor

The app includes a custom heart cursor effect—toggle in [cursor.service.ts](src/app/service/cursor.service.ts).

## 📸 Keeping Photos Private

Your intimate moments should stay private. Here's how:

### .gitignore Configuration

```gitignore
# Already configured in this project
/src/assets/private/
/public/private/
private-images.json
```

### Using Cloud Storage (Recommended)

1. **Create a free [Cloudinary](https://cloudinary.com) account**
2. **Upload your photos**
3. **Copy the URLs**
4. **Update [gallery.service.ts](src/app/service/gallery.service.ts)**:

```typescript
private images: string[] = [
  'https://res.cloudinary.com/your-cloud/image/upload/photo1.jpg',
  'https://res.cloudinary.com/your-cloud/image/upload/photo2.jpg',
  // More photos...
];
```

5. **Commit & Deploy** - Only URLs are in the code, never the actual images!

## 💡 Pro Tips

- **Test the flow**: Try different unlock times during development
- **Optimize images**: Use WebP format for faster loading
- **Mobile first**: The app is fully responsive—test on different devices
- **Personal touches**: Add Easter eggs, inside jokes, or special dates
- **Backup messages**: Keep a copy of your love notes somewhere safe

## 🤝 Contributing

This is a personal love project, but feel free to fork it and create your own romantic web app! Spread the love (and code).

## 📜 License

Love is free, and so is this code. Use it to make someone special smile. ❤️

## 🙏 Acknowledgments

Built with:
- ❤️ Angular 19
- 🎨 Tailwind CSS 4
- 💖 Love and dedication
- ☕ Lots of coffee and late nights

---

<div align="center">

**Made with 💖 for someone special**

*"Code may have bugs, but true love never does."*

</div>
