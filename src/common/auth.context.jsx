import { createContext, useEffect, useState } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup 
} from 'firebase/auth'
import { auth } from '../firebase/firebase.js'
import { createUserProfile, getUserProfile, updateUserLastSeen } from '../firebase/firestore.service.js'

export const AuthContext = createContext(null)

const STORAGE_KEY = 'expense-track-auth'

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Try to get user profile from Firestore
        const { success, data: userProfile } = await getUserProfile(firebaseUser.uid)
        
        if (success) {
          setUser(userProfile)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile))
        } else {
          // Create fallback user profile from Firebase auth data
          const fallbackProfile = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            userName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            phoneNumber: firebaseUser.phoneNumber || '',
            photoURL: firebaseUser.photoURL || '',
            currency: 'PKR',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: 'en',
            isActive: true,
            isEmailVerified: firebaseUser.emailVerified || false,
            lastLoginAt: new Date().toISOString(),
            lastSeenAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
          }
          
          setUser(fallbackProfile)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackProfile))
          
          // Try to create profile in Firestore (don't block if it fails)
          try {
            await createUserProfile(firebaseUser.uid, {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
              phoneNumber: firebaseUser.phoneNumber,
            })
          } catch (error) {
            console.warn('Could not create Firestore profile:', error.message)
          }
        }
        
        // Try to update last seen (don't block if it fails)
        try {
          await updateUserLastSeen(firebaseUser.uid)
        } catch (error) {
          console.warn('Could not update last seen:', error.message)
        }
      } else {
        setUser(null)
        localStorage.removeItem(STORAGE_KEY)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signin = async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Create fallback profile from auth data
      const fallbackProfile = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        userName: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
        phoneNumber: userCredential.user.phoneNumber || '',
        photoURL: userCredential.user.photoURL || '',
        currency: 'PKR',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: 'en',
        isActive: true,
        isEmailVerified: userCredential.user.emailVerified || false,
        lastLoginAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      }
      
      setUser(fallbackProfile)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackProfile))
      
      // Try to get/create Firestore profile (don't block)
      try {
        const { success, data: userProfile } = await getUserProfile(userCredential.user.uid)
        if (success) {
          setUser(userProfile)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile))
        } else {
          await createUserProfile(userCredential.user.uid, {
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            emailVerified: userCredential.user.emailVerified,
          })
        }
      } catch (error) {
        console.warn('Firestore profile operations failed:', error.message)
      }
      
      return { success: true, user: fallbackProfile }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  const signup = async ({ email, password, name }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create fallback profile from auth data
      const fallbackProfile = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        userName: name || userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
        phoneNumber: userCredential.user.phoneNumber || '',
        photoURL: userCredential.user.photoURL || '',
        currency: 'PKR',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: 'en',
        isActive: true,
        isEmailVerified: userCredential.user.emailVerified || false,
        lastLoginAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      }
      
      setUser(fallbackProfile)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackProfile))
      
      // Try to create Firestore profile (don't block)
      try {
        await createUserProfile(userCredential.user.uid, {
          email: userCredential.user.email,
          displayName: name,
          emailVerified: userCredential.user.emailVerified,
        })
      } catch (error) {
        console.warn('Could not create Firestore profile:', error.message)
      }
      
      return { success: true, user: fallbackProfile }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      
      // Create fallback profile from auth data
      const fallbackProfile = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        userName: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
        phoneNumber: userCredential.user.phoneNumber || '',
        photoURL: userCredential.user.photoURL || '',
        currency: 'PKR',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: 'en',
        isActive: true,
        isEmailVerified: userCredential.user.emailVerified || false,
        lastLoginAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      }
      
      setUser(fallbackProfile)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackProfile))
      
      // Try to create Firestore profile (don't block)
      try {
        await createUserProfile(userCredential.user.uid, {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          emailVerified: userCredential.user.emailVerified,
        })
      } catch (error) {
        console.warn('Could not create Firestore profile:', error.message)
      }
      
      return { success: true, user: fallbackProfile }
    } catch (error) {
      console.error('Google sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  const signout = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      localStorage.removeItem(STORAGE_KEY)
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: error.message }
    }
  }

  const updateProfile = async (patch) => {
    if (!user) return { success: false, error: 'No user logged in' }
    
    try {
      setUser((prev) => (prev ? { ...prev, ...patch } : prev))
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...user, ...patch }))
      return { success: true }
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, error: error.message }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signin,
        signup,
        signout,
        signInWithGoogle,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
