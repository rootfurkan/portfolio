// Admin panelinde tekrar tekrar kullanacagimiz input bileseni
export const FormInput = ({ label, error, ...props }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
    )}
    <input
      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
      {...props}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
)

export const FormTextarea = ({ label, error, ...props }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
    )}
    <textarea
      rows={4}
      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm resize-none"
      {...props}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
)

export const FormCheckbox = ({ label, ...props }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="checkbox"
      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900"
      {...props}
    />
    <span className="text-sm text-gray-300">{label}</span>
  </label>
)

// Panel baslik bileseni
export const PanelHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
    {action && action}
  </div>
)

// Kaydet butonu
export const SaveButton = ({ loading, children = 'Kaydet' }) => (
  <button
    type="submit"
    disabled={loading}
    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
  >
    {loading ? (
      <>
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        Kaydediliyor...
      </>
    ) : children}
  </button>
)

// Silme butonu
export const DeleteButton = ({ onClick, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
  >
    Sil
  </button>
)

// Kart bileseni
export const AdminCard = ({ children, className = '' }) => (
  <div className={"bg-gray-900 rounded-xl border border-gray-800 p-6 " + className}>
    {children}
  </div>
)