import { useEffect, useState } from 'react'
import { fetchAccounts } from '../api/accounts'
import { createIncome, fetchIncomes } from '../api/incomes'
import DataTable from '../components/DataTable'

const initialForm = {
  amount: '',
  date: '',
  source: '',
  category: '',
  accountId: ''
}

function IncomesPage() {
  const [accounts, setAccounts] = useState([])
  const [incomes, setIncomes] = useState([])
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  const load = () => {
    fetchAccounts().then(setAccounts).catch(console.error)
    fetchIncomes().then(setIncomes).catch(console.error)
  }

  useEffect(() => {
    load()
  }, [])

  const validate = () => {
    const e = {}
    if (!form.accountId) e.accountId = 'Account is required'
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Amount must be positive'
    if (!form.date) e.date = 'Date is required'
    if (!form.source) e.source = 'Source is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    await createIncome({
      ...form,
      amount: Number(form.amount),
      accountId: Number(form.accountId)
    })
    setForm(initialForm)
    load()
  }

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'source', label: 'Source' },
    { key: 'category', label: 'Category' }
  ]

  return (
    <div className="form-grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)' }}>
      <div className="card">
        <div className="card-title">Add Income</div>
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
            <label className="form-label">Source</label>
            <input
              className="form-input"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            />
            {errors.source && <div className="form-error">{errors.source}</div>}
          </div>
          <div className="form-row">
            <label className="form-label">Category</label>
            <input
              className="form-input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <button className="button button-primary" type="submit">
            Add income
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">Incomes</div>
        <DataTable columns={columns} data={incomes} />
      </div>
    </div>
  )
}

export default IncomesPage
