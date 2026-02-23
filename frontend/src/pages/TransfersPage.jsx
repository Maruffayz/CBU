import { useEffect, useState } from 'react'
import { fetchAccounts } from '../api/accounts'
import { createTransfer } from '../api/transfers'

const initialForm = {
  fromAccountId: '',
  toAccountId: '',
  amount: '',
  exchangeRate: 1,
  date: ''
}

function TransfersPage() {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchAccounts().then(setAccounts).catch(console.error)
  }, [])

  const validate = () => {
    const e = {}
    if (!form.fromAccountId) e.fromAccountId = 'From account is required'
    if (!form.toAccountId) e.toAccountId = 'To account is required'
    if (form.fromAccountId && form.toAccountId && form.fromAccountId === form.toAccountId)
      e.toAccountId = 'Accounts must be different'
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Amount must be positive'
    if (!form.exchangeRate || Number(form.exchangeRate) <= 0)
      e.exchangeRate = 'Exchange rate must be positive'
    if (!form.date) e.date = 'Date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    await createTransfer({
      ...form,
      amount: Number(form.amount),
      exchangeRate: Number(form.exchangeRate),
      fromAccountId: Number(form.fromAccountId),
      toAccountId: Number(form.toAccountId)
    })
    setForm(initialForm)
  }

  return (
    <div className="card" style={{ maxWidth: 600 }}>
      <div className="card-title">Transfer Between Accounts</div>
      <form className="form-grid" onSubmit={onSubmit}>
        <div className="form-row">
          <label className="form-label">From account</label>
          <select
            className="form-select"
            value={form.fromAccountId}
            onChange={(e) => setForm({ ...form, fromAccountId: e.target.value })}
          >
            <option value="">Select account</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.currency})
              </option>
            ))}
          </select>
          {errors.fromAccountId && <div className="form-error">{errors.fromAccountId}</div>}
        </div>
        <div className="form-row">
          <label className="form-label">To account</label>
          <select
            className="form-select"
            value={form.toAccountId}
            onChange={(e) => setForm({ ...form, toAccountId: e.target.value })}
          >
            <option value="">Select account</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.currency})
              </option>
            ))}
          </select>
          {errors.toAccountId && <div className="form-error">{errors.toAccountId}</div>}
        </div>
        <div className="form-row">
          <label className="form-label">Amount (from currency)</label>
          <input
            type="number"
            className="form-input"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          {errors.amount && <div className="form-error">{errors.amount}</div>}
        </div>
        <div className="form-row">
          <label className="form-label">Exchange rate</label>
          <input
            type="number"
            step="0.0001"
            className="form-input"
            value={form.exchangeRate}
            onChange={(e) => setForm({ ...form, exchangeRate: e.target.value })}
          />
          {errors.exchangeRate && <div className="form-error">{errors.exchangeRate}</div>}
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
        <button className="button button-primary" type="submit">
          Submit transfer
        </button>
      </form>
    </div>
  )
}

export default TransfersPage
