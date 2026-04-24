import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './themes/ThemeContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import MatchDetailsPage from './pages/MatchDetailsPage'
import GamesPage from './pages/GamesPage'
import GamePlayPage from './pages/GamePlayPage'
import PredictionsPage from './pages/PredictionsPage'
import PromotionsPage from './pages/PromotionsPage'
import BookingRedeemPage from './pages/BookingRedeemPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MyBetsPage from './pages/MyBetsPage'
import WalletPage from './pages/WalletPage'
import ProfilePage from './pages/ProfilePage'
import ReferralsPage from './pages/ReferralsPage'
import VipLandingPage from './pages/vip/VipLandingPage'
import VipGiftsPage from './pages/vip/VipGiftsPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminLinksPage from './pages/admin/AdminLinksPage'
import AdminBookingCodesPage from './pages/admin/AdminBookingCodesPage'
import AdminPredictionsPage from './pages/admin/AdminPredictionsPage'
import AdminGamesPage from './pages/admin/AdminGamesPage'
import AdminPayoutsPage from './pages/admin/AdminPayoutsPage'
import SuperAdminPage from './pages/super-admin/SuperAdminPage'
import RequireAuth from './components/auth/RequireAuth'
import { SUPER_ADMIN_PATH } from './config/routes'

function App() {
  const { theme } = useTheme()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-dark text-text-primary" data-theme={theme}>
        <Routes>
          {/* Public routes (no login) */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/matches/:id" element={<MatchDetailsPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/:slug" element={<GamePlayPage />} />
            <Route path="/predictions" element={<PredictionsPage predictions={[]} onAddToSlip={() => {}} />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/booking" element={<BookingRedeemPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* User routes (login required) */}
            <Route
              path="/bets"
              element={
                <RequireAuth roles={['USER', 'ADMIN', 'SUPER_ADMIN']}>
                  <MyBetsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/wallet"
              element={
                <RequireAuth roles={['USER', 'ADMIN', 'SUPER_ADMIN']}>
                  <WalletPage />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth roles={['USER', 'ADMIN', 'SUPER_ADMIN']}>
                  <ProfilePage />
                </RequireAuth>
              }
            />
            <Route
              path="/referrals"
              element={
                <RequireAuth roles={['USER', 'ADMIN', 'SUPER_ADMIN']}>
                  <ReferralsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/vip"
              element={
                <RequireAuth roles={['USER', 'ADMIN', 'SUPER_ADMIN']}>
                  <VipLandingPage />
                </RequireAuth>
              }
            />
            <Route
              path="/vip/gifts"
              element={
                <RequireAuth roles={['USER', 'ADMIN', 'SUPER_ADMIN']}>
                  <VipGiftsPage />
                </RequireAuth>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <RequireAuth roles={['ADMIN', 'SUPER_ADMIN']}>
                  <AdminDashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RequireAuth roles={['ADMIN', 'SUPER_ADMIN']}>
                  <AdminUsersPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/links"
              element={
                <RequireAuth roles={['ADMIN', 'SUPER_ADMIN']}>
                  <AdminLinksPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/booking-codes"
              element={
                <RequireAuth roles={['ADMIN', 'SUPER_ADMIN']}>
                  <AdminBookingCodesPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/predictions"
              element={
                <RequireAuth roles={['ADMIN', 'SUPER_ADMIN']}>
                  <AdminPredictionsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/games"
              element={
                <RequireAuth roles={['ADMIN', 'SUPER_ADMIN']}>
                  <AdminGamesPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/payouts"
              element={
                <RequireAuth roles={['ADMIN', 'SUPER_ADMIN']}>
                  <AdminPayoutsPage />
                </RequireAuth>
              }
            />

            {/* Super Admin (hidden path from env) */}
            <Route
              path={SUPER_ADMIN_PATH}
              element={
                <RequireAuth roles={['SUPER_ADMIN']}>
                  <SuperAdminPage />
                </RequireAuth>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
