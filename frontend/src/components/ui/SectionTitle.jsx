const SectionTitle = ({ title, subtitle, center = false }) => {
  return (
    <div className={"mb-14 " + (center ? 'text-center' : '')}>
      <h2
        className="text-3xl sm:text-4xl font-bold mb-3"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-lg max-w-xl"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
        >
          {subtitle}
        </p>
      )}
      <div
        className={"mt-5 h-1 w-14 rounded-full " + (center ? 'mx-auto' : '')}
        style={{
          background: 'linear-gradient(90deg, var(--accent), var(--accent-2, var(--accent)))',
          boxShadow: '0 0 12px var(--accent)',
        }}
      />
    </div>
  )
}

export default SectionTitle