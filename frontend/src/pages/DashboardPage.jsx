import { useEffect, useState } from 'react'
import { fetchSummaryStats } from '../api/statistics'
import SummaryCard from '../components/SummaryCard'
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart'
import CategoryPieChart from '../components/charts/CategoryPieChart'

function DashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchSummaryStats().then(setStats).catch(console.error)
  }, [])

  if (!stats) {
    return <div>Loading...</div>
  }

  return (
    <div className="form-grid" style={{ gap: '1.5rem' }}>
      <div className="card-grid">
        <SummaryCard title="Total Income" value={stats.totalIncome} />
        <SummaryCard title="Total Expense" value={stats.totalExpense} />
        <SummaryCard title="Net Balance" value={stats.netBalance} />
      </div>

      <div className="card">
        <IncomeExpenseChart
          monthlyIncome={stats.monthlyIncome || {}}
          monthlyExpense={stats.monthlyExpense || {}}
        />
      </div>

      <div className="card-grid">
        <div className="card">
          <CategoryPieChart dataMap={stats.expenseByCategory || {}} title="Expense by Category" />
        </div>
        <div className="card">
          <CategoryPieChart dataMap={stats.incomeByCategory || {}} title="Income by Category" />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
