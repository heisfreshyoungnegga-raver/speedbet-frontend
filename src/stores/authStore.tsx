import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  first_name?: string
  last_name?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true })
        // Mock login - in real app this would be an API call
        const mockUser: User = {
          id: '1',
          email,
          role: email.includes('admin') ? 'ADMIN' : 'USER',
          first_name: 'John',
          last_name: 'Doe',
        }
        const mockToken = 'mock-jwt-token-' + Date.now()
        set({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false })
        localStorage.setItem('speedbet-token', mockToken)
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem('speedbet-token')
      },

      checkAuth: async () => {
        const token = localStorage.getItem('speedbet-token')
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null })
          return
        }
        // Mock auth check - in real app, verify token with API
        const mockUser: User = {
          id: '1',
          email: 'user@speedbet.com',
          role: 'USER',
        }
        set({ isAuthenticated: true, user: mockUser, token })
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
)

export default useAuthStore
export { useAuthStore }
export const useAuth = useAuthStore
