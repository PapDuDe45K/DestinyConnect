'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

type StudentProfile = {
  full_name: string
  short_bio: string
  top_skills: string
  qualifications: string
  interests: string
  experience_level: string
  location: string
}

export default function StudentCompleteProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [profile, setProfile] = useState<StudentProfile>({
    full_name: '',
    short_bio: '',
    top_skills: '',
    qualifications: '',
    interests: '',
    experience_level: 'Entry-Level',
    location: '',
  })

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
          alert('🎉 Profile complete! Welcome to your student dashboard.')
          sessionStorage.setItem(toastKey, 'true')
        }
        router.replace('/dashboard/student')
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
      await setDoc(doc(db, 'students', user.uid), {
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
        body: JSON.stringify({
          uid: user.uid,
          role: 'student',
          fullName: profile.full_name,
          bio: profile.short_bio,
          skills: profile.top_skills,
          qualifications: profile.qualifications,
          interests: profile.interests,
          experienceLevel: profile.experience_level,
          location: profile.location,
        }),
      })

      if (!response.ok) throw new Error('Django API failed.')

      await setDoc(doc(db, 'users', user.uid), {
        profile_completed: true,
        role: 'student',
      }, { merge: true })

      router.push('/dashboard/student')
    } catch (error) {
      console.error('Error:', error)
      alert('Profile submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields: { label: string; name: keyof StudentProfile; type?: string }[] = [
    { label: 'Full Name', name: 'full_name' },
    { label: 'Short Bio', name: 'short_bio' },
    { label: 'Top Skills (comma-separated)', name: 'top_skills' },
    { label: 'Qualifications', name: 'qualifications' },
    { label: 'Areas of Interest', name: 'interests' },
    { label: 'Location', name: 'location' },
    { label: 'Experience Level', name: 'experience_level' },
  ]

  if (checkingAuth) return <div className="text-center py-10 text-gray-500">Checking authentication...</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Complete Your Student Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ label, name }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              id={name}
              name={name}
              value={profile[name]}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Submit Profile'}
        </button>
      </form>
    </div>
  )
}
