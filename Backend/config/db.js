// config/db.js
// ─────────────────────────────────────────────
// Connects our app to MongoDB Atlas using Mongoose.
// Mongoose is an ODM (Object Data Modeling) library —
// it lets us define schemas and interact with MongoDB
// using JavaScript objects instead of raw queries.
// ─────────────────────────────────────────────

const mongoose = require("mongoose");
const dns = require("dns");

// ── Fix: Local router DNS (gpon.net / fe80::1) cannot resolve MongoDB Atlas
// SRV records. Override to use Google Public DNS before any connection attempt.
dns.setDefaultResultOrder("ipv4first"); // prefer IPv4 answers
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); // Google + Cloudflare DNS

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      family: 4,        // 👈 Force IPv4 — avoids fe80::1 IPv6 local DNS
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure if DB connection fails
    process.exit(1);
  }
};

module.exports = connectDB;