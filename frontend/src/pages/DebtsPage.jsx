import { useEffect, useState } from 'react'
import { createDebt, fetchDebts, updateDebt } from '../api/debts'
import DataTable from '../components/DataTable'

const initialForm = {
  personName: '',
  amount: '',
  type: 'GIVEN',
  status: 'OPEN',
  dueDate: ''
}

function DebtsPage() {
  const [debts, setDebts] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})

  const load = () => {
    fetchDebts().then(setDebts).catch(console.error)
  }

  useEffect(() => {
    load()
  }, [])

  const validate = () => {
    const e = {}
    if (!form.personName) e.personName = 'Name is required'
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Amount must be positive'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    const payload = { ...form, amount: Number(form.amount) }
    if (editingId) {
      await updateDebt(editingId, payload)
    } else {
      await createDebt(payload)
    }
    setForm(initialForm)
    setEditingId(null)
    load()
  }

  const startEdit = (row) => {
    setEditingId(row.id)
    setForm({
      personName: row.personName,
      amount: row.amount,
      type: row.type,
      status: row.status,
      dueDate: row.dueDate || ''
    })
  }

  const columns = [
    { key: 'personName', label: 'Person' },
    { key: 'amount', label: 'Amount' },
    { key: 'type', label: 'Type' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`badge ${value === 'OPEN' ? 'badge-warning' : 'badge-success'}`}>{value}</span>
      )
    },
    { key: 'dueDate', label: 'Due date' }
  ]

  return (
    <div className="form-grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)' }}>
      <div className="card">
        <div className="card-title">Debt</div>
        <form className="form-grid" onSubmit={onSubmit}>
          <div className="form-row">
            <label className="form-label">Person</label>
            <input
              className="form-input"
              value={form.personName}
              onChange={(e) => setForm({ ...form, personName: e.target.value })}
            />
            {errors.personName && <div className="form-error">{errors.personName}</div>}
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
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="GIVEN">Given</option>
              <option value="RECEIVED">Received</option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label">Due date</label>
            <input
              type="date"
              className="form-input"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
          <button className="button button-primary" type="submit">
            {editingId ? 'Update debt' : 'Add debt'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">Debts</div>
        <DataTable
          columns={columns}
          data={debts}
          actions={[{ label: 'Edit', onClick: startEdit }]}
        />
      </div>
    </div>
  )
}

export default DebtsPage
