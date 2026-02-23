import { useEffect, useState } from 'react'
import { createBudget, fetchBudgetsForMonth } from '../api/budgets'
import DataTable from '../components/DataTable'

const initialForm = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  category: '',
  limitAmount: ''
}

function BudgetsPage() {
  const [form, setForm] = useState(initialForm)
  const [budgets, setBudgets] = useState([])
  const [errors, setErrors] = useState({})

  const load = () => {
    fetchBudgetsForMonth(form.year, form.month).then(setBudgets).catch(console.error)
  }

  useEffect(() => {
    load()
  }, [])

  const validate = () => {
    const e = {}
    if (!form.category) e.category = 'Category is required'
    if (!form.limitAmount || Number(form.limitAmount) <= 0)
      e.limitAmount = 'Limit must be positive'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    await createBudget({
      ...form,
      month: Number(form.month),
      year: Number(form.year),
      limitAmount: Number(form.limitAmount)
    })
    setForm({ ...form, category: '', limitAmount: '' })
    load()
  }

  const onChangeMonthYear = (field, value) => {
    const next = { ...form, [field]: value }
    setForm(next)
    fetchBudgetsForMonth(Number(next.year), Number(next.month)).then(setBudgets).catch(console.error)
  }

  const columns = [
    { key: 'category', label: 'Category' },
    { key: 'limitAmount', label: 'Limit' },
    { key: 'actualExpense', label: 'Actual' },
    {
      key: 'overBudget',
      label: 'Status',
      render: (val) => (
        <span className={`badge ${val ? 'badge-warning' : 'badge-success'}`}>
          {val ? 'Over budget' : 'OK'}
        </span>
      )
    }
  ]

  return (
    <div className="form-grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)' }}>
      <div className="card">
        <div className="card-title">Monthly Budget</div>
        <form className="form-grid" onSubmit={onSubmit}>
          <div className="form-row">
            <label className="form-label">Year</label>
            <input
              type="number"
              className="form-input"
              value={form.year}
              onChange={(e) => onChangeMonthYear('year', e.target.value)}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Month</label>
            <input
              type="number"
              min="1"
              max="12"
              className="form-input"
              value={form.month}
              onChange={(e) => onChangeMonthYear('month', e.target.value)}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Category</label>
            <input
              className="form-input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            {errors.category && <div className="form-error">{errors.category}</div>}
          </div>
          <div className="form-row">
            <label className="form-label">Limit amount</label>
            <input
              type="number"
              className="form-input"
              value={form.limitAmount}
              onChange={(e) => setForm({ ...form, limitAmount: e.target.value })}
            />
            {errors.limitAmount && <div className="form-error">{errors.limitAmount}</div>}
          </div>
          <button className="button button-primary" type="submit">
            Save budget
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">Budgets for month</div>
        <DataTable columns={columns} data={budgets} />
      </div>
    </div>
  )
}

export default BudgetsPage
