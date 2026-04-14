import { useState, useEffect, useRef } from 'react'
import { generateQuote } from '../utils/generateQuote'

export default function QuoteFormModal({ lineItems, onClose }) {
  const [form, setForm] = useState({ customerName: '', contact: '', poNumber: '', notes: '' })
  const firstRef = useRef(null)

  useEffect(() => {
    firstRef.current?.focus()
    const handleKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    const customerLabel = [form.customerName, form.contact].filter(Boolean).join(' — ')
    const notesLines = [
      form.poNumber ? `PO#: ${form.poNumber}` : '',
      form.notes,
    ].filter(Boolean).join('\n')
    generateQuote(lineItems, { customerName: customerLabel, notes: notesLines })
    onClose()
  }

  const field = (label, key, placeholder, opts = {}) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#6e6e73' }}>
        {label}
      </label>
      {opts.multiline ? (
        <textarea
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          rows={3}
          className="text-[13px] px-3 py-2 rounded-[10px] focus:outline-none resize-none"
          style={{
            background: 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.08)',
            color: '#1c1c1e',
          }}
        />
      ) : (
        <input
          ref={opts.first ? firstRef : undefined}
          type="text"
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className="text-[13px] px-3 py-2 rounded-[10px] focus:outline-none"
          style={{
            background: 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.08)',
            color: '#1c1c1e',
          }}
        />
      )}
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" style={{ backdropFilter: 'blur(4px)' }} />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden card-enter"
        style={{ background: 'white', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex items-start justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#6e6e73' }}>Generate Quote</p>
            <h2 className="text-[17px] font-bold mt-0.5" style={{ color: '#1c1c1e' }}>Customer Details</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full mt-0.5"
            style={{ background: 'rgba(0,0,0,0.06)', color: '#6e6e73' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-3.5">
          {field('Company / Customer', 'customerName', 'e.g. Acme Corp', { first: true })}
          {field('Contact Name', 'contact', 'e.g. Jane Smith')}
          {field('PO Number', 'poNumber', 'e.g. PO-12345')}
          {field('Notes', 'notes', 'Any additional notes for this quote…', { multiline: true })}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-[13px] font-medium rounded-xl focus:outline-none"
              style={{ background: '#f2f2f7', color: '#1c1c1e', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] py-2.5 text-[13px] font-semibold rounded-xl focus:outline-none inline-flex items-center justify-center gap-2"
              style={{ background: '#c8102e', color: 'white' }}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
