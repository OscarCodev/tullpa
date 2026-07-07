'use client'

import { useActionState } from 'react'
import { login } from './actions'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <div className="login" style={{ fontFamily: 'var(--body)' }}>
      <div className="login-card">
        <div className="login-brand">
          <span className="em">🥘</span>
          <b>Tullpa</b>
        </div>
        <h1>Panel del personal</h1>
        <p className="sub">Ingresa para gestionar la carta y atender los pedidos entrantes.</p>

        <form action={formAction}>
          <div className="dfield">
            <label>Correo Electrónico</label>
            <input
              name="email"
              type="email"
              placeholder="rosa@example.com"
              required
              autoComplete="off"
            />
          </div>

          <div className="dfield">
            <label>Contraseña</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          {state?.error && (
            <div style={{ color: 'var(--ember)', fontSize: '13px', textAlign: 'center', margin: '10px 0' }}>
              ⚠️ {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary btn-block"
            style={{ marginTop: '8px' }}
          >
            {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="hint" style={{ marginTop: '16px' }}>
          Demo: <b>rosa@example.com</b> / <b>tullpa123</b>
        </div>
      </div>
    </div>
  )
}
