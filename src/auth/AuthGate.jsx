import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import supabase from '../lib/supabase'

function SpinnerPage({ text = 'Validando acesso...' }) {
  return (
    <div className="auth-page" aria-busy="true" aria-live="polite">
      <div className="auth-container">
        <main className="auth-card" role="status" aria-label={text}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <span className="inline-flex" aria-hidden style={{ height: 24, width: 24 }}>
              <span style={{ display: 'block', height: '100%', width: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(139,92,246,.9), rgba(14,165,233,.8))' }} />
            </span>
            <div className="caption text-soft">{text}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AuthGate({ children }) {
  const { user } = useAuth()
  const [state, setState] = useState({ loading: true, allowed: false })

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!user) { window.location.assign('/login'); return }
      try {
        const { data } = await supabase.auth.getSession()
        const token = data?.session?.access_token
        if (!token) { window.location.assign('/login'); return }
        const base = import.meta.env.VITE_PUBLIC_BASE_URL || ''
        const res = await fetch(`${base}/api/bootstrap`, { headers: { Authorization: `Bearer ${token}` } })
        const payload = await res.json().catch(() => ({}))
        if (res.ok && payload?.subscription?.active) {
          if (!cancelled) setState({ loading: false, allowed: true })
        } else {
          window.location.assign('/subscribe')
        }
      } catch (_e) {
        window.location.assign('/subscribe')
      }
    }
    run()
    return () => { cancelled = true }
  }, [user])

  if (state.loading) return <SpinnerPage text="Validando acesso..." />
  return state.allowed ? children : null
}

