
/**
 * VAS LOGISTICS NEXUS - PRODUCTION BACKEND V2.6
 * AGGREGATOR ENGINE: AWB Generation, Barcode Logic, Charge Persistence
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// --- DATABASE LINK ---
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vas_logistics_v2';
mongoose.connect(MONGO_URI)
  .then(() => console.log('🚀 AGGREGATOR CORE: Database Persistent State Active'))
  .catch(err => console.error('❌ AGGREGATOR ERROR:', err));

// --- SCHEMAS ---

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, default: () => new Date().toLocaleString('en-GB') },
  awb: { type: String, unique: true },
  barcodeUrl: String,
  status: { type: String, default: 'Created' },
  category: String,
  tag: String,
  products: Array,
  package: { dimensions: String, deadWt: String, volumetric: String },
  shipping: { name: String, phone: String, address: String, zip: String, country: String },
  pickup: String,
  financials: {
    declaredValue: Number,
    shippingCharge: Number,
    insuranceCharge: Number,
    codCharge: Number,
    totalPayable: Number,
    currency: { type: String, default: 'INR' }
  },
  payment: { method: String, status: String, invoice: String }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, default: 'admin' },
  walletBalance: { type: Number, default: 5000.00 },
  apiKey: { type: String, default: 'VAS_LIVE_$(6772_KEY_9901_AUTH_771)' }
});
const User = mongoose.model('User', userSchema);

// --- BUSINESS LOGIC HELPERS ---

const generateUniqueAWB = () => {
    const prefix = "VAS-DX";
    const random = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}-${random}`;
};

const calculateCharges = (data) => {
    const declaredValue = parseFloat(data.declaredValue) || 0;
    const isInsured = data.isInsured === true;
    const isCod = data.paymentMethod === 'COD';
    
    // Aggregator Pricing Logic
    const shippingCharge = 65.00; 
    const insuranceCharge = isInsured ? (declaredValue * 0.02) : 0; // 2% Premium
    const codCharge = isCod ? 50.00 : 0; // Fixed COD Surcharge
    
    return {
        declaredValue,
        shippingCharge,
        insuranceCharge,
        codCharge,
        totalPayable: shippingCharge + insuranceCharge + codCharge,
        currency: 'INR'
    };
};

// --- AUTHENTICATION ---
const authenticate = async (req, res, next) => {
    const auth = req.headers['authorization'];
    if (auth === 'Bearer VAS_LIVE_$(6772_KEY_9901_AUTH_771)') {
        let user = await User.findOne({ username: 'admin' });
        if(!user) user = await User.create({ username: 'admin' });
        req.user = user;
        next();
    } else {
        res.status(401).json({ error: 'Access Denied' });
    }
};

// --- ROUTES ---

app.get('/api/v2/orders', authenticate, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Sync Error' });
    }
});

app.post('/api/v2/orders/create', authenticate, async (req, res) => {
    try {
        const data = req.body;

        // 1. Mandatory Field Validation
        const mandatory = ['id', 'shipping', 'package', 'declaredValue', 'paymentMethod'];
        for(let field of mandatory) {
            if(!data[field]) return res.status(400).json({ error: `Mandatory Field Missing: ${field}` });
        }

        // 2. Generate unique AWB and Barcode Link
        const awb = generateUniqueAWB();
        const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${awb.replace(/-/g,'')}&scale=2&rotate=N&includetext=0`;
        
        // 3. Calculate Charges (Business Rules)
        const financials = calculateCharges(data);
        
        const finalOrder = new Order({
            id: data.id,
            category: data.category || 'Domestic',
            tag: data.tag || 'Manual Entry',
            products: data.products || [],
            package: data.package,
            shipping: data.shipping,
            pickup: data.pickup,
            awb,
            barcodeUrl,
            financials,
            status: 'AWB Generated',
            payment: {
                method: data.paymentMethod,
                status: 'Pending',
                invoice: `₹ ${financials.totalPayable.toFixed(2)}`
            }
        });

        await finalOrder.save();
        res.json({ success: true, order: finalOrder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/v2/wallet/balance', authenticate, (req, res) => {
    res.json({ balance: req.user.walletBalance });
});

app.get('/health', (req, res) => res.json({ status: 'Operational', engine: 'Aggregator V2.6' }));

app.listen(PORT, () => console.log(`🚀 AGGREGATOR SYSTEM ONLINE ON PORT ${PORT}`));
