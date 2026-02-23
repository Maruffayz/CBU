import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import AccountsPage from './pages/AccountsPage'
import ExpensesPage from './pages/ExpensesPage'
import IncomesPage from './pages/IncomesPage'
import TransfersPage from './pages/TransfersPage'
import DebtsPage from './pages/DebtsPage'
import BudgetsPage from './pages/BudgetsPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/incomes" element={<IncomesPage />} />
        <Route path="/transfers" element={<TransfersPage />} />
        <Route path="/debts" element={<DebtsPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
      </Routes>
    </Layout>
  )
}

export default App
