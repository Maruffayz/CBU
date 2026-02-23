import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

function CategoryPieChart({ dataMap = {}, title }) {
  const labels = Object.keys(dataMap)
  const values = Object.values(dataMap)

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ['#22c55e', '#0ea5e9', '#f97316', '#a855f7', '#facc15', '#ef4444']
      }
    ]
  }

  return (
    <div>
      {title && <div className="card-title" style={{ marginBottom: '0.5rem' }}>{title}</div>}
      <Pie data={data} options={{ plugins: { legend: { position: 'bottom' } } }} />
    </div>
  )
}

export default CategoryPieChart
