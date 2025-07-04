'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

type CompanyProfile = {
  company_name: string
  industry: string
  description: string
  website: string
  company_size: string
  location: string
  company_values: string
  open_roles: string
}

export default function CompanyCompleteProfile() {
  const router = useRouter()
  const [profile, setProfile] = useState<CompanyProfile>({
    company_name: '',
    industry: '',
    description: '',
    website: '',
    company_size: '',
    location: '',
    company_values: '',
    open_roles: '',
  })

  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace('/login')
        return
      }

      const userDocSnap = await getDoc(doc(db, 'users', user.uid))
      if (userDocSnap.exists() && userDocSnap.data().profile_completed) {
        const toastKey = `dashboard_completion_toast_shown_${user.uid}`
        if (!sessionStorage.getItem(toastKey)) {
          alert('🎉 Profile complete! Welcome to your company dashboard.')
          sessionStorage.setItem(toastKey, 'true')
        }
        router.replace('/dashboard/company')
        return
      }

      setCheckingAuth(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = auth.currentUser
    if (!user) return
    setLoading(true)

    try {
      await setDoc(doc(db, 'companies', user.uid), {
        ...profile,
        user_id: user.uid,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      })

      const token = await user.getIdToken()
      const response = await fetch('http://localhost:8000/api/accounts/save-profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firebase_id: user.uid, ...profile }),
      })

      if (!response.ok) throw new Error('Django API failed.')

      await setDoc(doc(db, 'users', user.uid), {
        profile_completed: true,
        role: 'company',
      }, { merge: true })

      router.push('/dashboard/company')
    } catch (error) {
      console.error('Error:', error)
      alert('Profile submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields: { label: string; name: keyof CompanyProfile }[] = [
    { label: 'Company Name', name: 'company_name' },
    { label: 'Industry', name: 'industry' },
    { label: 'Description', name: 'description' },
    { label: 'Website URL', name: 'website' },
    { label: 'Company Size', name: 'company_size' },
    { label: 'Location', name: 'location' },
    { label: 'Company Values', name: 'company_values' },
    { label: 'Open Roles', name: 'open_roles' },
  ]

  if (checkingAuth) return <div className="text-center py-10 text-gray-500">Checking authentication...</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Complete Your Company Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ label, name }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="text"
              id={name}
              name={name}
              value={profile[name]}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Submit Profile'}
        </button>
      </form>
    </div>
  )
}
