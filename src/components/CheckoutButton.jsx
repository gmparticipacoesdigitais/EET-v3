export default function CheckoutButton({ label = 'Assinar', className = '', ariaLabel }) {
  const href = (import.meta && import.meta.env && import.meta.env.VITE_HOTMART_PAY_URL)
    || 'https://pay.hotmart.com/Q102005462K?checkoutMode=2'
  const onClick = () => { window.location.href = href }
  return (
    <a onClick={(e)=>{e.preventDefault();onClick()}} href={href} className={`btn btn-primary ${className}`.trim()} aria-label={ariaLabel || 'Assinar plano'}>
      {label}
    </a>
  )
}
