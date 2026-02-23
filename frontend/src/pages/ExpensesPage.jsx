import { useEffect, useState } from 'react'
import { fetchAccounts } from '../api/accounts'
import { createExpense, deleteExpense, fetchExpenses, updateExpense } from '../api/expenses'
import DataTable from '../components/DataTable'

const initialForm = {
  amount: '',
  date: '',
  description: '',
  category: '',
  accountId: ''
}

function ExpensesPage() {
  const [accounts, setAccounts] = useState([])
  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})

  const load = () => {
    fetchAccounts().then(setAccounts).catch(console.error)
    fetchExpenses().then(setExpenses).catch(console.error)
  }

  useEffect(() => {
    load()
  }, [])

  const validate = () => {
    const e = {}
    if (!form.accountId) e.accountId = 'Account is required'
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Amount must be positive'
    if (!form.date) e.date = 'Date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    const payload = {
      ...form,
      amount: Number(form.amount),
      accountId: Number(form.accountId)
    }
    if (editingId) {
      await updateExpense(editingId, payload)
    } else {
      await createExpense(payload)
    }
    setForm(initialForm)
    setEditingId(null)
    load()
  }

  const startEdit = (expense) => {
    setEditingId(expense.id)
    setForm({
      amount: expense.amount,
      date: expense.date,
      description: expense.description || '',
      category: expense.category || '',
      accountId: expense.accountId
    })
  }

  const remove = async (row) => {
    await deleteExpense(row.id)
    load()
  }

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' }
  ]

  return (
    <div className="form-grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)' }}>
      <div className="card">
        <div className="card-title">Add / Edit Expense</div>
        <form className="form-grid" onSubmit={onSubmit}>
          <div className="form-row">
            <label className="form-label">Account</label>
            <select
              className="form-select"
              value={form.accountId}
              onChange={(e) => setForm({ ...form, accountId: e.target.value })}
            >
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.currency})
                </option>
              ))}
            </select>
            {errors.accountId && <div className="form-error">{errors.accountId}</div>}
          </div>
          <div className="form-row">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-input"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            {errors.amount && <div className="form-error">{errors.amount}</div>}
          </div>
          <div className="form-row">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            {errors.date && <div className="form-error">{errors.date}</div>}
          </div>
          <div className="form-row">
            <label className="form-label">Category</label>
            <input
              className="form-input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Leave blank for auto-categorization"
            />
          </div>
          <div className="form-row">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button className="button button-primary" type="submit">
            {editingId ? 'Update expense' : 'Add expense'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">Expenses</div>
        <DataTable
          columns={columns}
          data={expenses}
          actions={[
            { label: 'Edit', onClick: startEdit },
            { label: 'Delete', onClick: remove, variant: 'danger' }
          ]}
        />
      </div>
    </div>
  )
}

export default ExpensesPage
