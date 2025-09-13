import { Router } from "express";
import Joi from "joi";
import { db } from "../services/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

async function ensureAccount(userId) {
  const existing = await db.oneOrNone(
    "SELECT id, balance FROM accounts WHERE user_id=$1",
    [userId]
  );
  if (existing) return existing;
  return db.one(
    "INSERT INTO accounts (user_id, balance) VALUES ($1, 0) RETURNING id, balance",
    [userId]
  );
}

async function recalcBalance(userId) {
  const rows = await db.any(
    "SELECT type, amount FROM transactions WHERE user_id=$1",
    [userId]
  );
  let balance = 0;
  for (const t of rows) balance += t.type === "deposit" ? t.amount : -t.amount;
  await db.query(
    "UPDATE accounts SET balance=$1, updated_at=now() WHERE user_id=$2",
    [balance, userId]
  );
  return balance;
}

router.use(requireAuth);

router.get("/balance", async (req, res) => {
  try {
    const acc = await ensureAccount(req.user.id);
    return res.json({ balance: acc.balance });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const txSchema = Joi.object({
  type: Joi.string().valid("deposit", "withdraw").required(),
  amount: Joi.number().integer().min(0).max(100000).required(),
});

router.get("/transactions", async (req, res) => {
  try {
    const list = await db.any(
      "SELECT id, type, amount, created_at FROM transactions WHERE user_id=$1 ORDER BY created_at DESC, id DESC",
      [req.user.id]
    );
    const acc = await ensureAccount(req.user.id);
    return res.json({ transactions: list, balance: acc.balance });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/transactions", async (req, res) => {
  const { error, value } = txSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const { type, amount } = value;
  try {
    await ensureAccount(req.user.id);
    const current = await db.one(
      "SELECT balance FROM accounts WHERE user_id=$1",
      [req.user.id]
    );
    const projected = current.balance + (type === "deposit" ? amount : -amount);
    if (projected < 0)
      return res.status(400).json({ message: "Insufficient funds" });
    const tx = await db.one(
      "INSERT INTO transactions (user_id, type, amount) VALUES ($1, $2, $3) RETURNING id, type, amount, created_at",
      [req.user.id, type, amount]
    );
    const balance = await recalcBalance(req.user.id);
    return res.status(201).json({ transaction: tx, balance });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const editSchema = Joi.object({
  amount: Joi.number().integer().min(0).max(100000).required(),
});

router.put("/transactions/:id", async (req, res) => {
  const { error, value } = editSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const id = Number(req.params.id);
  if (!Number.isInteger(id))
    return res.status(400).json({ message: "Invalid id" });
  try {
    const tx = await db.oneOrNone(
      "SELECT id, type FROM transactions WHERE id=$1 AND user_id=$2",
      [id, req.user.id]
    );
    if (!tx) return res.status(404).json({ message: "Not found" });
    await db.query("UPDATE transactions SET amount=$1 WHERE id=$2", [
      value.amount,
      id,
    ]);
    const balance = await recalcBalance(req.user.id);
    if (balance < 0) {
      return res.status(400).json({ message: "Insufficient funds after edit" });
    }
    const updated = await db.one(
      "SELECT id, type, amount, created_at FROM transactions WHERE id=$1",
      [id]
    );
    return res.json({ transaction: updated, balance });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/transactions/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id))
    return res.status(400).json({ message: "Invalid id" });
  try {
    const tx = await db.oneOrNone(
      "SELECT id FROM transactions WHERE id=$1 AND user_id=$2",
      [id, req.user.id]
    );
    if (!tx) return res.status(404).json({ message: "Not found" });
    await db.query("DELETE FROM transactions WHERE id=$1", [id]);
    const balance = await recalcBalance(req.user.id);
    return res.json({ ok: true, balance });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
