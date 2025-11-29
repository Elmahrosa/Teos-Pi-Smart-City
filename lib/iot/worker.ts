import { evaluateAllBadgeRules } from "./rules";

const WORKER_SECRET = process.env.WORKER_SECRET;

if (!WORKER_SECRET) {
  throw new Error("WORKER_SECRET must be set in environment");
}

async function runWorker() {
  console.log("🚀 IoT Governance Worker started");

  setInterval(async () => {
    try {
      console.log("🔍 Evaluating badge rules...");
      await evaluateAllBadgeRules();
      console.log("✅ Badge evaluation complete");
    } catch (err) {
      console.error("❌ Worker error:", err);
    }
  }, 60000); // Run every minute
}

runWorker().catch(console.error);
