const variants = {
  primary: 'bg-accent hover:bg-accent-dark text-white',
  secondary: 'bg-navy-700 hover:bg-navy-600 text-white',
  outline: 'border border-navy-600 hover:border-accent text-white bg-transparent',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'hover:bg-navy-800 text-gray-300',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;
