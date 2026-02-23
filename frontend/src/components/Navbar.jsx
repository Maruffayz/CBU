import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/incomes', label: 'Incomes' },
  { to: '/transfers', label: 'Transfers' },
  { to: '/debts', label: 'Debts' },
  { to: '/budgets', label: 'Budgets' }
]

function Navbar() {
  return (
    <nav>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : 'inactive'}`}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default Navbar
