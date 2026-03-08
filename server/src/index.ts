import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';
import mandiRoutes from './routes/mandi.routes';
import advisoryRoutes from './routes/advisory.routes';
import weatherRoutes from './routes/weather.routes';
import forumRoutes from './routes/forum.routes';
import { MandiService } from './services/mandi.service';

import { errorHandler } from './middleware/errorHandler';

import nodeCron from 'node-cron';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});
const PORT = process.env.PORT || 5000;

// 1. Rate Limiting (Security)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests, please try again later." }
});

// 2. Middleware
app.use(limiter);
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(express.json());

// 3. Routes
app.use('/api/mandi', mandiRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/forum', forumRoutes);

// 4. Diagnostics & Maintenance
app.get('/api/diagnostics', async (req, res) => {
  let stats = { prices: 0, directory: 0, msp: 0 };
  try {
    if (supabase) {
      const { count: pCount } = await supabase.from('prices').select('*', { count: 'exact', head: true });
      const { count: dCount } = await supabase.from('mandi_directory').select('*', { count: 'exact', head: true });
      const { count: mCount } = await supabase.from('msp_values').select('*', { count: 'exact', head: true });
      stats = { prices: pCount || 0, directory: dCount || 0, msp: mCount || 0 };
    }
  } catch (e) {}

  res.json({
    status: "healthy",
    gemini: !!process.env.GEMINI_KEY,
    supabase: !!process.env.SUPABASE_KEY,
    data_gov: !!process.env.DATA_GOV_API_KEY,
    db_stats: stats,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/admin/force-sync', async (req, res) => {
  console.log('⚡ Manual sync triggered via API');
  MandiService.discoverAllMetadata();
  MandiService.syncAllMarketPrices();
  res.json({ success: true, message: "Sync started in background" });
});

// 5. Error Handler
app.use(errorHandler);

// 6. Real-time Price Pulse (WebSockets)
const CROP_MODAL_BASICS: Record<string, number> = {
  "Wheat": 2350, "Paddy": 2280, "Mustard": 5920, "Bajra": 2580, "Cotton": 7150
};
const MANDIS = ["Karnal", "Hisar", "Rohtak", "Sirsa", "Ambala", "Kaithal", "Panipat", "Rewari"];

setInterval(async () => {
  const crop = Object.keys(CROP_MODAL_BASICS)[Math.floor(Math.random() * 5)] || "Wheat";
  const mandi = MANDIS[Math.floor(Math.random() * MANDIS.length)] || "Karnal";
  const basePrice = CROP_MODAL_BASICS[crop] || 2000;
  const pulsePrice = Math.round(basePrice + (Math.random() * 60 - 30));

  io.emit('pricePulse', {
    id: Date.now(),
    mandi,
    crop,
    price: pulsePrice,
    change: pulsePrice > basePrice ? 'up' : 'down',
    timestamp: new Date().toLocaleTimeString()
  });
}, 10000); 

io.on('connection', (socket) => {
  console.log('📱 Client connected to Mandi Pulses');
  socket.on('disconnect', () => console.log('📴 Client disconnected'));
});

// 7. Background Services
// Initial sync on boot
MandiService.discoverAllMetadata();
MandiService.syncAllMarketPrices();

// Schedule Price Sync: 12 AM and 12 PM
nodeCron.schedule('0 0,12 * * *', () => {
  console.log('⏰ [Cron] Starting Scheduled Price Sync (12h)...');
  MandiService.syncAllMarketPrices();
});

// Schedule Metadata Refresh: Once a day at 3 AM
nodeCron.schedule('0 3 * * *', () => {
  console.log('⏰ [Cron] Running Daily Metadata Refresh...');
  MandiService.discoverAllMetadata();
});

// 8. Start Server
httpServer.listen(PORT, () => {
  console.log(`🚀 KisanNiti Enterprise Server (TS) running on port ${PORT}`);
});
