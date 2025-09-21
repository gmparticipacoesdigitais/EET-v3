export default function CheckoutButton({ label = 'Assinar', className = '', ariaLabel }) {
  const href = (import.meta && import.meta.env && (import.meta.env.VITE_STRIPE_PAYMENT_LINK || import.meta.env.VITE_HOTMART_PAY_URL))
    || 'https://buy.stripe.com/test_5kQ7sM5oXdJq9PZ2TQ'
  const onClick = () => { window.location.href = href }
  return (
    <a onClick={(e)=>{e.preventDefault();onClick()}} href={href} className={`btn btn-primary ${className}`.trim()} aria-label={ariaLabel || 'Assinar plano'}>
      {label}
    </a>
  )
}
