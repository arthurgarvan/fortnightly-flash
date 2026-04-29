const fs = require('fs');

async function fetchMarketData() {
  const PROMPT = `You are a senior Australian agricultural market analyst specializing in commodity prices, seasonal trends, and market forecasting.

Analyze the current Australian agricultural market and provide a detailed report in the following JSON format:

{
  "timestamp": "ISO_8601_timestamp",
  "markets": [
    {
      "commodity": "Commodity name",
      "price": numeric_price_per_unit,
      "unit": "measurement unit",
      "change24h": percentage_change,
      "volume": trading_volume_number,
      "trend": "bullish|bearish|neutral",
      "forecast": "brief forecast text"
    }
  ],
  "summary": "Overall market analysis and key insights"
}

Focus on major Australian agricultural commodities like wheat, barley, cotton, wool, beef, and dairy. Include current pricing, volume data, and 24-hour price movements. Provide actionable insights for farmers and traders.`;

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
        max_tokens: 2000,
        messages: [{ role: 'user', content: PROMPT }]
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`API Error: ${res.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await res.json();
    
    if (!data.content || data.content.length === 0) {
      throw new Error('No content in API response');
    }

    const text = data.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');
    
    // Clean the JSON response
    const cleanJson = text.replace(/```json|```/gi, '').trim();
    
    // Validate JSON before writing
    JSON.parse(cleanJson);
    
    fs.writeFileSync('data.json', cleanJson);
    console.log('✅ Successfully updated data.json at', new Date().toISOString());

  } catch(error) {
    console.error('❌ Fetch error:', error.message);
    process.exit(1);
  }
}

fetchMarketData();
