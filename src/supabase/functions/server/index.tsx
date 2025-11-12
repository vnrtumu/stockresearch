import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Connect a new broker account
app.post('/make-server-10388338/brokers/connect', async (c) => {
  try {
    const { broker, clientId, apiKey, apiSecret, userId } = await c.req.json();

    if (!broker || !clientId || !userId) {
      return c.json({ error: 'Missing required fields: broker, clientId, userId' }, 400);
    }

    // Store broker credentials securely
    const brokerKey = `broker:${userId}:${broker.toLowerCase()}`;
    const brokerData = {
      broker,
      clientId,
      apiKey: apiKey || '',
      apiSecret: apiSecret || '',
      status: 'connected',
      connectedAt: new Date().toISOString(),
      lastSynced: null,
    };

    await kv.set(brokerKey, brokerData);

    console.log(`Broker connected successfully for user ${userId}: ${broker}`);
    return c.json({ success: true, message: 'Broker connected successfully', broker: brokerData });
  } catch (error) {
    console.error('Error connecting broker:', error);
    return c.json({ error: 'Failed to connect broker', details: String(error) }, 500);
  }
});

// Get all connected brokers for a user
app.get('/make-server-10388338/brokers/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const brokerPrefix = `broker:${userId}:`;
    
    const brokers = await kv.getByPrefix(brokerPrefix);
    
    return c.json({ success: true, brokers });
  } catch (error) {
    console.error('Error fetching brokers:', error);
    return c.json({ error: 'Failed to fetch brokers', details: String(error) }, 500);
  }
});

// Sync portfolio data from broker
app.post('/make-server-10388338/brokers/sync', async (c) => {
  try {
    const { userId, broker } = await c.req.json();

    if (!userId || !broker) {
      return c.json({ error: 'Missing required fields: userId, broker' }, 400);
    }

    // Get broker credentials
    const brokerKey = `broker:${userId}:${broker.toLowerCase()}`;
    const brokerData = await kv.get(brokerKey);

    if (!brokerData) {
      return c.json({ error: 'Broker not connected' }, 404);
    }

    // Simulate fetching data from broker API
    // In real implementation, you would call the actual broker API here
    const portfolioData = await fetchBrokerPortfolio(broker, brokerData);

    // Store portfolio data
    const portfolioKey = `portfolio:${userId}:${broker.toLowerCase()}`;
    await kv.set(portfolioKey, {
      broker,
      holdings: portfolioData.holdings,
      summary: portfolioData.summary,
      lastSynced: new Date().toISOString(),
    });

    // Update broker last synced time
    brokerData.lastSynced = new Date().toISOString();
    await kv.set(brokerKey, brokerData);

    console.log(`Portfolio synced successfully for user ${userId}: ${broker}`);
    return c.json({ 
      success: true, 
      message: 'Portfolio synced successfully',
      data: portfolioData 
    });
  } catch (error) {
    console.error('Error syncing portfolio:', error);
    return c.json({ error: 'Failed to sync portfolio', details: String(error) }, 500);
  }
});

// Get portfolio data for a user
app.get('/make-server-10388338/portfolio/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const portfolioPrefix = `portfolio:${userId}:`;
    
    const portfolios = await kv.getByPrefix(portfolioPrefix);
    
    // Aggregate data across all brokers
    let totalInvestment = 0;
    let totalCurrentValue = 0;
    let allHoldings: any[] = [];

    portfolios.forEach((portfolio: any) => {
      if (portfolio.summary) {
        totalInvestment += portfolio.summary.invested || 0;
        totalCurrentValue += portfolio.summary.currentValue || 0;
      }
      if (portfolio.holdings) {
        allHoldings = [...allHoldings, ...portfolio.holdings];
      }
    });

    const totalReturns = totalCurrentValue - totalInvestment;
    const returnsPercent = totalInvestment > 0 ? ((totalReturns / totalInvestment) * 100).toFixed(2) : '0.00';

    return c.json({
      success: true,
      summary: {
        totalInvestment,
        totalCurrentValue,
        totalReturns,
        returnsPercent,
      },
      holdings: allHoldings,
      portfolios,
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return c.json({ error: 'Failed to fetch portfolio', details: String(error) }, 500);
  }
});

// Disconnect a broker
app.delete('/make-server-10388338/brokers/:userId/:broker', async (c) => {
  try {
    const userId = c.req.param('userId');
    const broker = c.req.param('broker');

    const brokerKey = `broker:${userId}:${broker.toLowerCase()}`;
    const portfolioKey = `portfolio:${userId}:${broker.toLowerCase()}`;

    await kv.del(brokerKey);
    await kv.del(portfolioKey);

    console.log(`Broker disconnected successfully for user ${userId}: ${broker}`);
    return c.json({ success: true, message: 'Broker disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting broker:', error);
    return c.json({ error: 'Failed to disconnect broker', details: String(error) }, 500);
  }
});

// Mock function to simulate fetching data from broker API
// In production, this would make actual API calls to broker platforms
async function fetchBrokerPortfolio(broker: string, credentials: any) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock data based on broker
  const mockData: Record<string, any> = {
    'zerodha': {
      holdings: [
        {
          symbol: 'RELIANCE',
          name: 'Reliance Industries',
          quantity: 50,
          avgPrice: 2200.00,
          currentPrice: 2456.80,
          investedValue: 110000.00,
          currentValue: 122840.00,
        },
        {
          symbol: 'HDFCBANK',
          name: 'HDFC Bank',
          quantity: 100,
          avgPrice: 1650.00,
          currentPrice: 1623.40,
          investedValue: 165000.00,
          currentValue: 162340.00,
        },
        {
          symbol: 'BHARTIARTL',
          name: 'Bharti Airtel',
          quantity: 80,
          avgPrice: 820.00,
          currentPrice: 872.30,
          investedValue: 65600.00,
          currentValue: 69784.00,
        },
      ],
      summary: {
        invested: 340600.00,
        currentValue: 354964.00,
        returns: 14364.00,
        returnsPercent: 4.22,
      },
    },
    'groww': {
      holdings: [
        {
          symbol: 'TCS',
          name: 'Tata Consultancy Services',
          quantity: 25,
          avgPrice: 3400.00,
          currentPrice: 3589.50,
          investedValue: 85000.00,
          currentValue: 89737.50,
        },
        {
          symbol: 'ICICIBANK',
          name: 'ICICI Bank',
          quantity: 150,
          avgPrice: 890.00,
          currentPrice: 934.60,
          investedValue: 133500.00,
          currentValue: 140190.00,
        },
        {
          symbol: 'ASIANPAINT',
          name: 'Asian Paints',
          quantity: 15,
          avgPrice: 3100.00,
          currentPrice: 3245.70,
          investedValue: 46500.00,
          currentValue: 48685.50,
        },
      ],
      summary: {
        invested: 265000.00,
        currentValue: 278613.00,
        returns: 13613.00,
        returnsPercent: 5.14,
      },
    },
    'upstox': {
      holdings: [
        {
          symbol: 'INFY',
          name: 'Infosys Limited',
          quantity: 75,
          avgPrice: 1320.00,
          currentPrice: 1445.25,
          investedValue: 99000.00,
          currentValue: 108393.75,
        },
        {
          symbol: 'ITC',
          name: 'ITC Limited',
          quantity: 200,
          avgPrice: 420.00,
          currentPrice: 445.60,
          investedValue: 84000.00,
          currentValue: 89120.00,
        },
      ],
      summary: {
        invested: 183000.00,
        currentValue: 197513.75,
        returns: 14513.75,
        returnsPercent: 7.93,
      },
    },
  };

  const brokerLower = broker.toLowerCase();
  return mockData[brokerLower] || {
    holdings: [],
    summary: {
      invested: 0,
      currentValue: 0,
      returns: 0,
      returnsPercent: 0,
    },
  };
}

Deno.serve(app.fetch);
