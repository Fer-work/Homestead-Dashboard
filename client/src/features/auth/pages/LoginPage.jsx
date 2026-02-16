import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Box,
  Tab,
  Tabs,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useLoginMutation, useRegisterMutation } from '../authApi.js'
import { setCredentials } from '../authSlice.js'
import { PATHS } from '../../../routes/pathConstants.js'

export default function LoginPage({ initialTab = 0 }) {
  const [tab, setTab] = useState(initialTab)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || PATHS.OVERVIEW

  const [login, { isLoading: loginLoading }] = useLoginMutation()
  const [register, { isLoading: registerLoading }] = useRegisterMutation()
  const isLoading = loginLoading || registerLoading

  const resetForm = () => {
    setEmail('')
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setError(null)
  }

  const handleTabChange = (_, newValue) => {
    setTab(newValue)
    resetForm()
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const result = await login({ email, password }).unwrap()
      dispatch(setCredentials({ user: result.user, token: result.token }))
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.data?.message || 'Login failed')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      const result = await register({ email, username, password }).unwrap()
      dispatch(setCredentials({ user: result.user, token: result.token }))
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.data?.message || 'Registration failed')
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 3 }}>
        <Tab label="Sign In" />
        <Tab label="Register" />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {tab === 0 ? (
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoFocus
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {loginLoading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoFocus
          />
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {registerLoading ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>
        </Box>
      )}
    </Box>
  )
}
