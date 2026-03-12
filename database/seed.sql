-- ============================================================
-- Seed Data - Default Categories
-- ============================================================

-- Insert default expense categories (user_id NULL = global defaults)
INSERT INTO categories (id, user_id, name, type, icon, color, is_default) VALUES
  (uuid_generate_v4(), NULL, 'Food & Dining',   'EXPENSE', '🍔', '#ef4444', TRUE),
  (uuid_generate_v4(), NULL, 'Transport',        'EXPENSE', '🚗', '#f97316', TRUE),
  (uuid_generate_v4(), NULL, 'Shopping',         'EXPENSE', '🛍️', '#eab308', TRUE),
  (uuid_generate_v4(), NULL, 'Utilities',        'EXPENSE', '⚡', '#84cc16', TRUE),
  (uuid_generate_v4(), NULL, 'Healthcare',       'EXPENSE', '🏥', '#06b6d4', TRUE),
  (uuid_generate_v4(), NULL, 'Entertainment',    'EXPENSE', '🎬', '#8b5cf6', TRUE),
  (uuid_generate_v4(), NULL, 'Education',        'EXPENSE', '📚', '#ec4899', TRUE),
  (uuid_generate_v4(), NULL, 'Housing',          'EXPENSE', '🏠', '#14b8a6', TRUE),
  (uuid_generate_v4(), NULL, 'Other Expense',    'EXPENSE', '💸', '#6b7280', TRUE),
  (uuid_generate_v4(), NULL, 'Salary',           'INCOME',  '💼', '#22c55e', TRUE),
  (uuid_generate_v4(), NULL, 'Freelance',        'INCOME',  '💻', '#3b82f6', TRUE),
  (uuid_generate_v4(), NULL, 'Investment',       'INCOME',  '📈', '#a855f7', TRUE),
  (uuid_generate_v4(), NULL, 'Gift',             'INCOME',  '🎁', '#f43f5e', TRUE),
  (uuid_generate_v4(), NULL, 'Other Income',     'INCOME',  '💰', '#6b7280', TRUE);
