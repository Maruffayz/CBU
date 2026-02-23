import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

function IncomeExpenseChart({ monthlyIncome = {}, monthlyExpense = {} }) {
  const labels = Array.from(
    new Set([...Object.keys(monthlyIncome), ...Object.keys(monthlyExpense)]).values()
  ).sort()

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: labels.map((l) => monthlyIncome[l] || 0),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22,163,74,0.2)'
      },
      {
        label: 'Expense',
        data: labels.map((l) => monthlyExpense[l] || 0),
        borderColor: '#b91c1c',
        backgroundColor: 'rgba(185,28,28,0.15)'
      }
    ]
  }

  return <Line data={data} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
}

export default IncomeExpenseChart
