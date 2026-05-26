// Base fetcher — attaches credentials so the session cookie is sent
async function fetcher(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Request failed: ${res.status}`)
  }

  return res.json()
}

// ── Schools ──────────────────────────────────────────────────────────
export const getSchools = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return fetcher(`/api/schools${qs ? `?${qs}` : ''}`)
}

export const getSchool = (schoolId) =>
  fetcher(`/api/schools/${schoolId}`)

export const createSchool = (data) =>
  fetcher('/api/schools', { method: 'POST', body: JSON.stringify(data) })

export const updateSchool = (schoolId, data) =>
  fetcher(`/api/schools/${schoolId}`, { method: 'PATCH', body: JSON.stringify(data) })

export const deleteSchool = (schoolId) =>
  fetcher(`/api/schools/${schoolId}`, { method: 'DELETE' })

// ── Students ─────────────────────────────────────────────────────────
export const getStudents = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return fetcher(`/api/students${qs ? `?${qs}` : ''}`)
}

// ── Teachers ─────────────────────────────────────────────────────────
export const getTeachers = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return fetcher(`/api/teachers${qs ? `?${qs}` : ''}`)
}

// ── Auth ─────────────────────────────────────────────────────────────
export const getMe = () => fetcher('/api/auth/me')

export const login = (credentials) =>
  fetcher('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) })

export const logout = () =>
  fetcher('/api/auth/logout', { method: 'POST' })