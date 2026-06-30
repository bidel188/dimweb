export default function Container({ className = '', children }) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-20 ${className}`}>
      {children}
    </div>
  )
}
