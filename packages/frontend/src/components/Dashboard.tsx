import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type Summary = {
  total: number
  byCategory: Record<string, { count: number; sum: number; avg: number }>
  min: number
  max: number
  avg: number
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('http://localhost:4000/api/summary')
        const json = await res.json()
        if (cancelled) return
        setSummary(json)
      } catch (e) {
        console.error(e)
      }
    })()
    return () => { cancelled = true }
  }, [])

  if (!summary) return <div className="dashboard">Cargando resumen...</div>

  const data = Object.entries(summary.byCategory).map(([category, v]) => ({ category, count: v.count }))

  return (
    <section className="dashboard">
      <div className="summary-cards">
        <div className="card">Total items<br/><strong>{summary.total}</strong></div>
        <div className="card">Min value<br/><strong>{summary.min}</strong></div>
        <div className="card">Max value<br/><strong>{summary.max}</strong></div>
        <div className="card">Avg value<br/><strong>{summary.avg}</strong></div>
      </div>

      <div className="chart-container">
        <h3>Items por categoría</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
