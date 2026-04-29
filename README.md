# ⚡ Fortnightly Flash

**Australian Agricultural Market Report Dashboard**

A fortnightly automated market report that analyzes Australian agricultural commodity prices using AI-powered insights.

## 📋 Project Structure

```
fortnightly-flash/
├── index.html                  # Market dashboard UI
├── data.json                   # Market data (updated fortnightly)
├── update-data.js              # AI script that fetches/generates data
├── README.md                   # This file
└── .github/
    └── workflows/
        └── schedule.yml        # Automated workflow
```

## 🎯 Features

- **Automated Fortnightly Updates**: Runs on the 1st and 15th of every month at 9:00 AM AEST
- **AI-Powered Analysis**: Uses Claude 3.5 Sonnet to generate market insights
- **Interactive Dashboard**: Beautiful, responsive UI with trend indicators
- **Market Trends**: Shows bullish/bearish/neutral sentiment for each commodity
- **Forecasts**: AI-generated price forecasts and market insights
- **Auto-Refresh**: Dashboard updates every 5 minutes when viewing
- **Manual Trigger**: Run updates anytime via GitHub Actions

## 📊 Supported Commodities

- 🌾 **Wheat** - AUD/tonne
- 🍺 **Barley** - AUD/tonne
- 🌾 **Cotton** - AUD/bale
- 🧵 **Wool** - AUD/kg
- 🥩 **Beef** - AUD/kg

## 🔧 Setup Instructions

### 1. Add API Key (Required)

1. Go to your repository: **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Name: `ANTHROPIC_API_KEY`
4. Value: Your Anthropic API key (get one at https://console.anthropic.com)
5. Click **Add secret**

### 2. Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/root`
3. Click **Save**

Your dashboard will be live at: `https://arthurgarvan.github.io/fortnightly-flash/`

### 3. Test Locally (Optional)

```bash
export ANTHROPIC_API_KEY="your-api-key"
node update-data.js
```

## 📅 Update Schedule

The workflow runs automatically:
- **1st of every month** at 22:00 UTC (9:00 AM AEST)
- **15th of every month** at 22:00 UTC (9:00 AM AEST)

To modify the schedule, edit `.github/workflows/schedule.yml`:

```yaml
cron: '0 22 1,15 * *'  # Format: minute hour day month weekday
```

**Cron Examples:**
- `0 22 * * *` - Daily at 22:00 UTC
- `0 22 * * 1` - Every Monday at 22:00 UTC
- `0 22 1 * *` - Monthly on the 1st at 22:00 UTC

## 🚀 Manual Triggers

Run an update anytime:
1. Go to **Actions** tab
2. Select **"Update Market Data"** workflow
3. Click **"Run workflow"** → **"Run workflow"**

## 📁 Data Format

`data.json` structure:

```json
{
  "timestamp": "2026-04-29T22:00:00Z",
  "markets": [
    {
      "commodity": "Wheat",
      "price": 245.50,
      "unit": "AUD/tonne",
      "change24h": 1.25,
      "volume": 125000,
      "trend": "bullish|bearish|neutral",
      "forecast": "Market analysis text"
    }
  ],
  "summary": "Overall market analysis"
}
```

## 🔐 Security

- API keys stored as GitHub Secrets (never exposed)
- Workflow has minimal permissions (write access to contents only)
- No sensitive data stored in repository

## 🐛 Troubleshooting

### Workflow not running?
- ✅ Verify Actions are enabled in Settings
- ✅ Check that `ANTHROPIC_API_KEY` secret is added
- ✅ Review workflow logs in Actions tab

### Dashboard showing old data?
- ✅ Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- ✅ Check that `data.json` exists in repository root
- ✅ Verify GitHub Pages is enabled and built successfully

### API Error?
- ✅ Verify API key has sufficient credits
- ✅ Check Anthropic API status at https://status.anthropic.com
- ✅ Review workflow logs for error messages

## 📈 Future Enhancements

- [ ] Historical price charting
- [ ] Price alerts via email
- [ ] Multi-month trend analysis
- [ ] Export data to CSV
- [ ] Additional commodities
- [ ] Regional price variations

## 📧 Support

For issues, open a GitHub issue or check the troubleshooting section above.

---

**Last Updated**: 2026-04-29  
**Made with ❤️ for Australian Agriculture**
