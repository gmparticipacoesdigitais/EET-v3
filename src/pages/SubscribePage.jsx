import { useEffect } from 'react'

export default function SubscribePage() {
  const href = (import.meta && import.meta.env && (import.meta.env.VITE_STRIPE_PAYMENT_LINK || import.meta.env.VITE_HOTMART_PAY_URL))
    || 'https://buy.stripe.com/test_5kQ7sM5oXdJq9PZ2TQ'

  useEffect(() => {
    // Redirect automatically to payment. Keep page as fallback.
    try { window.location.assign(href) } catch {}
  }, [href])

  return (
    <div className="auth-page">
      <div className="auth-container">
        <main className="auth-card" role="main" aria-labelledby="subscribeTitle">
          <div className="flex items-center" style={{ gap: 12, marginBottom: 12 }}>
            <span className="inline-flex" aria-hidden style={{ height: 36, width: 36 }}>
              <span style={{ display: 'block', height: '100%', width: '100%', borderRadius: 8, background: 'linear-gradient(135deg, rgba(139,92,246,.9), rgba(14,165,233,.8))' }} />
            </span>
            <h1 id="subscribeTitle" style={{ margin: 0 }}>Assinatura necessária</h1>
          </div>
          <p className="text-soft" style={{ marginTop: -8 }}>Redirecionando para o Stripe. Se não abrir, use o botão abaixo.</p>
          <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Abrir checkout Stripe</a>
          <div className="grid" style={{ gap: 12, marginTop: 16 }}><a className="btn btn-secondary" href="/">Voltar</a></div>
        </main>
      </div>
    </div>
  )
}
