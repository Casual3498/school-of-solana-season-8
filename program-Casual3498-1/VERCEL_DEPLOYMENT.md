# 🚀 Deploying Vote D-21 Frontend to Vercel

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy from frontend directory**:
```bash
cd frontend
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Choose your account
- Link to existing project? **No**
- Project name? **vote-d-21** (or your preferred name)
- Directory? **./** (current directory)
- Override settings? **No**

4. **Production deployment**:
```bash
vercel --prod
```

---

### Option 2: Deploy via GitHub + Vercel Dashboard

1. **Push to GitHub**:
```bash
# In project root
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

2. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com/
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
   - Click "Deploy"

---

### Option 3: One-Click Deploy

Click this button to deploy directly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO&project-name=vote-d-21&repo-name=vote-d-21)

*(Replace YOUR_USERNAME/YOUR_REPO with your actual repository)*

---

## Configuration

### Environment Variables (Optional)

If you want to configure RPC endpoints or other settings, you can add environment variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Settings → Environment Variables
3. Add variables like:
   - `NEXT_PUBLIC_SOLANA_RPC_HOST` = `https://api.devnet.solana.com`

---

## Project Structure

The frontend is a **Next.js 16** application with:
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Solana Web3.js**
- **Anchor Framework**
- **Wallet Adapter**

---

## Build Settings for Vercel

These are automatically detected, but for reference:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

---

## After Deployment

### 1. Get your URL
Your app will be live at: `https://your-project.vercel.app`

### 2. Test the deployment
- Open the URL
- Connect Phantom Wallet (set to Devnet)
- Get devnet SOL using the built-in button
- Initialize voter account
- Vote for 2 candidates

### 3. Custom Domain (Optional)
You can add a custom domain in Vercel Dashboard:
- Settings → Domains → Add Domain

---

## Troubleshooting

### Build fails with "Module not found"
Make sure all dependencies are in `package.json` and run:
```bash
cd frontend
npm install
```

### Wallet connection issues
- Ensure Phantom is set to **Devnet**
- Check browser console for errors
- Try clearing browser cache

### Program not found
- Verify program is deployed to devnet
- Check program ID in `utils/anchor.ts`
- Confirm connection endpoint is devnet

---

## Performance Optimization

Vercel automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Edge caching
- ✅ Image optimization
- ✅ Serverless functions

---

## Monitoring

View your deployment logs and analytics:
- Vercel Dashboard → Your Project → Deployments
- Real-time logs
- Performance metrics
- Error tracking

---

## Update Deployment

To update your live site:

**Via CLI:**
```bash
cd frontend
vercel --prod
```

**Via GitHub:**
Just push to your main branch - Vercel will auto-deploy!

---

## Share Your dApp! 🎉

After deployment, share your URL:
- Twitter
- Discord
- Telegram
- Reddit

Example message:
```
🗳️ Vote D-21 - Secure Two-Vote System on Solana!

Try it live: https://your-project.vercel.app

Built with:
✅ Solana Program (Anchor)
✅ Next.js + React
✅ Deployed on Devnet

Vote for 2 candidates from Alice, Bob, Charlie, and Diana!
```

---

## Program Details

- **Network**: Solana Devnet
- **Program ID**: `7qsdAz3ta9gg3eikuzQuJMj928zFnPUB8C4rb42pr6RN`
- **Explorer**: [View on Solana Explorer](https://explorer.solana.com/address/7qsdAz3ta9gg3eikuzQuJMj928zFnPUB8C4rb42pr6RN?cluster=devnet)

---

## Support

For issues or questions:
1. Check Vercel deployment logs
2. Review browser console
3. Check Solana Explorer for transactions
4. Verify wallet is on Devnet

---

**Happy Deploying! 🚀**

