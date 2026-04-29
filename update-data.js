const fs = require('fs');

async function fetchMarketData() {
  const PROMPT = `You are a senior Australian agricultural market analyst and commercial strategist with real-time web access. You specialise in beef and sheep markets, input costs, and producer decision-making.

Objective: Produce a highly concise, sales-focused "Fortnightly Flash" report that uses ONLY the most recent 14 days of data to justify investment in livestock efficiency (feed conversion, weight gain, methane reduction via bolus technology).

Strict Rules:
- Use ONLY data updated within the last 14 days. If unavailable, use the most recent data and clearly label it "(latest available)".
- Always prioritise Australian sources and Eastern states (NSW, VIC, QLD).
- Keep total output under 400 words.
- Use short, sharp, commercial language (sales-ready).
- Do NOT add commentary outside the template.
- Always include working source links (not homepages—link directly to data pages).

MANDATORY DATA SOURCES TO REFERENCE:
Cattle & Sheep Indicators (last 14 days + outlook):
- EYCI (Eastern Young Cattle Indicator): https://www.mla.com.au/prices-markets/cattle/eycireport/
- AYCI (AuctionsPlus Yearling Indicator): https://pulse.auctionsplus.com.au/market-commentary/weekly-cattle-market-report-2026
- Trade Lamb Indicator: https://www.mla.com.au/prices-markets/sheep/tradelamb/

Herd Trend:
- Female Slaughter Rate (FSR): https://www.mla.com.au/prices-markets/slaughter/?species=Cattle

Weather (last 14 days + outlook):
- BOM Rainfall: http://www.bom.gov.au/climate/rainfall/
- BOM Soil Moisture: http://www.bom.gov.au/climate/outlooks/

Input Costs:
- Grain: https://www.graincentral.com/markets/
- Diesel: https://www.aip.com.au/pricing

OUTPUT TEMPLATE (Do not deviate):

## Raw Data & Verification

| Metric | Current Value | MoM Trend | YoY Trend | Source Link |
|--------|---------------|-----------|-----------|-------------|
| EYCI | [Price] | [Trend] | [Trend] | https://www.mla.com.au/prices-markets/cattle/eycireport/ |
| AYCI | [Price] | [Trend] | [Trend] | https://pulse.auctionsplus.com.au/market-commentary/weekly-cattle-market-report-2026 |
| ESTLI | [Price] | [Trend] | [Trend] | https://www.mla.com.au/prices-markets/sheep/tradelamb/ |
| FSR | [Percentage] | [Trend] | N/A | https://www.mla.com.au/prices-markets/slaughter/?species=Cattle |
| Diesel | [Price] | [Trend] | N/A | https://www.aip.com.au/pricing |
| Grain | [Price] | [Trend] | N/A | https://www.graincentral.com/markets/ |

## ⚡ FORTNIGHTLY FLASH: [Current Month/Year]

### 📈 The Market Pulse

**Indicators:** [1-2 sentences summarizing EYCI, AYCI, and ESTLI movements with MoM and YoY context].

**Herd Phase:** [1-sentence on FSR and herd dynamics].

**Sales Hook:** [1-sentence punchy conclusion on why bolus maximizes ROI in current market].

### 🌦️ Weather & Feed Tactics

**NSW ([Dry/Wet/Neutral]):** [1 sentence]. **Action:** [Bolus-driven productivity angle].

**VIC ([Dry/Wet/Neutral]):** [1 sentence]. **Action:** [Bolus angle].

**QLD ([Dry/Wet/Neutral]):** [1 sentence]. **Action:** [Bolus angle].

### 🚜 Ag Calendar & The Bottom Line

**Operational Status:** Farmers are in [seasonal phase]. Workload is [High/Low]. Cash flow is [Tight/Strong].

**Input Pressure:** [1 sentence linking diesel + grain trends to margin pressure].

**The Pitch:** [1–2 sentences directly connecting current prices, seasonal pressure, and input costs to why investing in feed efficiency NOW delivers immediate ROI].

---

Tone Benchmark: Write like a commodity trader briefing a sales team — direct, confident, zero fluff.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 3000,
        messages: [{ role: 'user', content: PROMPT }]
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(\`API Error: \${res.status} - \${errorData.error?.message || 'Unknown error'}\`);
    }

    const data = await res.json();
    
    if (!data.content || data.content.length === 0) {
      throw new Error('No content in API response');
    }

    const report = data.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');
    
    // Create data.json with report
    const reportData = {
      timestamp: new Date().toISOString(),
      reportType: "Fortnightly Flash - Agricultural Market Analysis",
      report: report,
      datasources: {
        cattle: "https://www.mla.com.au/prices-markets/cattle/eycireport/",
        sheep: "https://www.mla.com.au/prices-markets/sheep/tradelamb/",
        weather: "http://www.bom.gov.au/climate/rainfall/",
        inputs: "https://www.graincentral.com/markets/"
      }
    };
    
    fs.writeFileSync('data.json', JSON.stringify(reportData, null, 2));
    console.log('✅ Successfully generated Fortnightly Flash report at', new Date().toISOString());

  } catch(error) {
    console.error('❌ Fetch error:', error.message);
    process.exit(1);
  }
}

fetchMarketData();
