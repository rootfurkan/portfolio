// Tüm sitede kullanacağımız tekil buton bileşeni
// variant prop'u ile farklı stiller alabilir
const Button = ({ 
  children, 
  variant = 'primary',  // primary | secondary | outline | ghost
  size = 'md',          // sm | md | lg
  className = '', 
  ...props 
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600',
    outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-indigo-400 dark:text-indigo-400',
    ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2'
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button