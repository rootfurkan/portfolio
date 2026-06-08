import ReactDatePicker, { registerLocale } from 'react-datepicker'
import { tr } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'
import { Calendar } from 'lucide-react'

// Türkçe dil kaydı
registerLocale('tr', tr)

/**
 * Kullanım:
 * <TarihSecici
 *   label="Başlangıç Tarihi"
 *   value="2023-06-01"           // string (YYYY-MM-DD) veya null
 *   onChange={(val) => ...}      // val => "2023-06-01" string veya null
 *   disabled={false}
 * />
 */
const TarihSecici = ({ label, value, onChange, disabled = false, placeholder = 'Tarih seçin' }) => {
  // String → Date dönüşümü
  const toDate = (val) => {
    if (!val) return null
    const d = new Date(val)
    return isNaN(d.getTime()) ? null : d
  }

  // Date → "YYYY-MM-DD" string dönüşümü
  const toString = (date) => {
    if (!date) return ''
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  return (
    <div className="datepicker-wrapper">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      )}
      <div className="relative">
        <ReactDatePicker
          selected={toDate(value)}
          onChange={(date) => onChange(toString(date))}
          locale="tr"
          dateFormat="dd MMMM yyyy"
          placeholderText={placeholder}
          disabled={disabled}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          yearDropdownItemNumber={30}
          popperPlacement="bottom-start"
          className={
            "w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 " +
            "text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 " +
            "focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer " +
            (disabled ? "opacity-50 cursor-not-allowed" : "")
          }
          wrapperClassName="w-full"
          popperClassName="datepicker-popper"
        />
        <Calendar
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: disabled ? '#4b5563' : '#818cf8' }}
        />
      </div>

      <style>{`
        /* Popper container */
        .datepicker-popper {
          z-index: 9999 !important;
        }

        /* Takvim kutusu */
        .react-datepicker {
          background-color: #111827 !important;
          border: 1px solid #374151 !important;
          border-radius: 12px !important;
          font-family: inherit !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6) !important;
          overflow: hidden !important;
        }

        /* Üst başlık (ay/yıl) */
        .react-datepicker__header {
          background-color: #1f2937 !important;
          border-bottom: 1px solid #374151 !important;
          border-radius: 0 !important;
          padding: 12px 8px 8px !important;
        }

        .react-datepicker__current-month {
          color: #f3f4f6 !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          margin-bottom: 8px !important;
        }

        /* Ay/yıl dropdown'ları */
        .react-datepicker__month-select,
        .react-datepicker__year-select {
          background-color: #374151 !important;
          color: #f3f4f6 !important;
          border: 1px solid #4b5563 !important;
          border-radius: 6px !important;
          padding: 3px 6px !important;
          font-size: 13px !important;
          cursor: pointer !important;
        }

        .react-datepicker__month-select:focus,
        .react-datepicker__year-select:focus {
          outline: none !important;
          border-color: #6366f1 !important;
        }

        /* Gün adları */
        .react-datepicker__day-name {
          color: #6366f1 !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          width: 32px !important;
          line-height: 32px !important;
        }

        /* Günler */
        .react-datepicker__day {
          color: #d1d5db !important;
          width: 32px !important;
          line-height: 32px !important;
          border-radius: 8px !important;
          font-size: 13px !important;
          transition: background 0.15s !important;
        }

        .react-datepicker__day:hover {
          background-color: #4f46e5 !important;
          color: #fff !important;
        }

        /* Seçili gün */
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #6366f1 !important;
          color: #fff !important;
          font-weight: 600 !important;
        }

        /* Bugün */
        .react-datepicker__day--today {
          font-weight: 700 !important;
          color: #818cf8 !important;
          border: 1px solid #6366f1 !important;
        }

        .react-datepicker__day--today.react-datepicker__day--selected {
          color: #fff !important;
          border: none !important;
        }

        /* Devre dışı günler */
        .react-datepicker__day--disabled {
          color: #4b5563 !important;
          cursor: not-allowed !important;
        }

        .react-datepicker__day--disabled:hover {
          background: transparent !important;
          color: #4b5563 !important;
        }

        /* Diğer ay günleri */
        .react-datepicker__day--outside-month {
          color: #374151 !important;
        }

        /* İleri/geri oklar */
        .react-datepicker__navigation-icon::before {
          border-color: #9ca3af !important;
        }

        .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
          border-color: #6366f1 !important;
        }

        /* Ay içeriği */
        .react-datepicker__month {
          margin: 8px !important;
        }

        /* Üçgen ok (popper arrow) gizle */
        .react-datepicker__triangle {
          display: none !important;
        }
      `}</style>
    </div>
  )
}

export default TarihSecici