import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getLedgers, createLedger } from "./routes/ledgers";
import { getTransactions, createTransaction, getDashboard } from "./routes/transactions";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Ledger routes
  app.get("/api/ledgers", getLedgers);
  app.post("/api/ledgers", createLedger);

  // Transaction routes
  app.get("/api/transactions", getTransactions);
  app.post("/api/transactions", createTransaction);

  // Dashboard route
  app.get("/api/dashboard", getDashboard);

  return app;
}
