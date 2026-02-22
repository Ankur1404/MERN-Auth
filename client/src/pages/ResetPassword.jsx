import React, { useContext, useState } from 'react'
import axiosInstance from '../../services/axiosInstance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'



const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1) // 1: email, 2: otp + password


  const navigate = useNavigate()

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text') || ''
    const digits = paste.replace(/\D/g, '').slice(0, 6)
    if (!digits) return
    setOtp(digits)
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    try {
      setIsSubmitting(true)
      
      const { data } = await axiosInstance.post(
        `/api/auth/send-password-reset-otp`,
        { email }
      )
      if (data.success) {
        toast.success(data.message || 'OTP sent to your email')
        setStep(2)
      } else {
        toast.error(data.message || 'Failed to send OTP')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send OTP')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpAndPasswordSubmit = async (e) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) return
    if (!newPassword || !confirmPassword) return
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setIsSubmitting(true)
      
      const { data } = await axiosInstance.post(
        `/api/auth/reset-password-with-otp`,
        { email, otp, newPassword }
      )
      if (data.success) {
        toast.success(data.message || 'Password reset successfully')
        setEmail('')
        setOtp('')
        setNewPassword('')
        setConfirmPassword('')
        setStep(1)
        navigate('/login')
      } else {
        toast.error(data.message || 'Password reset failed')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Password reset failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2 text-center">
          Reset your password
        </h1>

        {/* FORM 1: Email Input */}
        {step === 1 && (
          <>
            <p className="text-sm text-slate-500 mb-6 text-center">
              Enter your email address to receive an OTP.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                placeholder="your@email.com"
              />
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full mt-4 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          </>
        )}

        {/* FORM 2: OTP + Password Input */}
        {step === 2 && (
          <>
            <p className="text-sm text-slate-500 mb-6 text-center">
              Enter the OTP and your new password.
            </p>

            <form onSubmit={handleOtpAndPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  One-time password (OTP)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  onPaste={handlePaste}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 tracking-[0.5em] text-center text-lg"
                  placeholder="••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  New password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  placeholder="Enter new password (min. 6 characters)"
                />
                <p className="text-xs text-slate-500 mt-1">Min. 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  placeholder="Confirm password"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !otp || otp.length !== 6 || !newPassword || !confirmPassword || newPassword.length < 6 || newPassword !== confirmPassword}
                className="w-full mt-4 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Resetting...' : 'Reset password'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1)
                  setOtp('')
                  setNewPassword('')
                  setConfirmPassword('')
                }}
                className="w-full text-sm font-medium text-slate-600 hover:text-slate-900 underline underline-offset-4"
              >
                Back
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPassword