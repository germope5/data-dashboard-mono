import React, { useEffect, useState } from 'react'
import { fetchData, Row } from './api'
import DataTable from './components/DataTable'

export default function App() {
  const [rows, setRows] = useState<Row[]>([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [limit] = useState(50)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetchData(offset, limit, q, category)
      setRows(res.data)
      setTotal(res.total)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [offset, q, category])

  return (
    <div className="app">
      <header>
        <h1>Data Dashboard — MVP</h1>
      </header>

      <section className="controls">
        <input placeholder="Buscar..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
        <button onClick={() => { setOffset(0); load() }}>Filtrar</button>
      </section>

      <section>
        {loading ? <p>Cargando...</p> : <>
          <p>Total: {total}</p>
          <DataTable rows={rows} />
          <div className="pager">
            <button disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))}>Anterior</button>
            <button disabled={offset + limit >= total} onClick={() => setOffset(offset + limit)}>Siguiente</button>
          </div>
        </>}
      </section>
    </div>
  )
}
