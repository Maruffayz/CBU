import { useEffect, useState } from 'react'
import { createAccount, fetchAccounts } from '../api/accounts'
import { fetchSummaryStats } from '../api/statistics'
import SummaryCard from '../components/SummaryCard'

const initialForm = {
  name: '',
  type: 'CASH',
  currency: 'USD',
  balance: 0,
  userId: 1
}

function AccountsPage() {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const load = () => {
    fetchAccounts().then(setAccounts).catch(console.error)
  }

  useEffect(() => {
    load()
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name) e.name = 'Name is required'
    if (!form.currency) e.currency = 'Currency is required'
    if (form.balance < 0) e.balance = 'Balance cannot be negative'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await createAccount({ ...form, balance: Number(form.balance) })
      setForm(initialForm)
      load()
    } finally {
      setLoading(false)
    }
  }

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0)

  return (
    <div className="form-grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)' }}>
      <div className="card">
        <div className="card-title">Add Account</div>
        <form className="form-grid" onSubmit={submit}>
          <div className="form-row">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          <div className="form-row">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="ACCOUNT">Account</option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label">Currency</label>
            <input
              className="form-input"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            />
            {errors.currency && <div className="form-error">{errors.currency}</div>}
          </div>
          <div className="form-row">
            <label className="form-label">Initial Balance</label>
            <input
              type="number"
              className="form-input"
              value={form.balance}
              onChange={(e) => setForm({ ...form, balance: e.target.value })}
            />
            {errors.balance && <div className="form-error">{errors.balance}</div>}
          </div>
          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save account'}
          </button>
        </form>
      </div>

      <div className="form-grid">
        <SummaryCard title="Total Balance" value={totalBalance} />
        <div className="card">
          <div className="card-title">Accounts</div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Currency</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>{a.type}</td>
                  <td>{a.currency}</td>
                  <td>{a.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AccountsPage
