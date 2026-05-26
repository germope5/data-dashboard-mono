import React from 'react'
import type { Row } from '../api'
import { FixedSizeList as List, ListChildComponentProps } from 'react-window'

type Props = {
  rows: Row[];
}

const ROW_HEIGHT = 40

function RowRenderer({ index, style, data }: ListChildComponentProps) {
  const r: Row = data[index]
  return (
    <div className="virtual-row" style={style} role="row" aria-rowindex={index + 1}>
      <div className="virtual-cell id">{r.id}</div>
      <div className="virtual-cell name">{r.name}</div>
      <div className="virtual-cell value">{r.value}</div>
      <div className="virtual-cell category">{r.category}</div>
      <div className="virtual-cell date">{r.date}</div>
    </div>
  )
}

export default function DataTable({ rows }: Props) {
  const height = Math.min(600, rows.length * ROW_HEIGHT)
  return (
    <div className="table-wrap">
      <div className="data-table-header" role="rowgroup">
        <div className="virtual-row header">
          <div className="virtual-cell id">ID</div>
          <div className="virtual-cell name">Name</div>
          <div className="virtual-cell value">Value</div>
          <div className="virtual-cell category">Category</div>
          <div className="virtual-cell date">Date</div>
        </div>
      </div>
      <List
        height={height}
        itemCount={rows.length}
        itemSize={ROW_HEIGHT}
        width="100%"
        itemData={rows}
      >
        {RowRenderer}
      </List>
    </div>
  )
}
