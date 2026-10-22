const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
let expenses = [];
let nextId = 1;
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/expenses', (_req, res) => res.json(expenses));
app.post('/api/expenses', (req, res) => {
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
  const category = typeof req.body.category === 'string' ? req.body.category.trim() : '';
  const amount = Number(req.body.amount);
  if (!title || !category || !Number.isFinite(amount) || amount <= 0)
    return res.status(400).json({ error: 'Provide a title, category and amount greater than zero.' });
  const expense = { id: nextId++, title, category, amount: Math.round(amount * 100) / 100, date: new Date().toISOString().slice(0, 10) };
  expenses.push(expense);
  return res.status(201).json(expense);
});
app.delete('/api/expenses/:id', (req, res) => {
  const before = expenses.length;
  expenses = expenses.filter(e => e.id !== Number(req.params.id));
  if (before === expenses.length) return res.status(404).json({ error: 'Expense not found.' });
  return res.status(204).end();
});
module.exports = app;
