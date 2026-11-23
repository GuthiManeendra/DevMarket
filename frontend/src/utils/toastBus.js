let listeners = []

export function subscribeToast(listener) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((entry) => entry !== listener)
  }
}

export function toast(message, type = 'info') {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  listeners.forEach((listener) => listener({ id, message, type }))
}
