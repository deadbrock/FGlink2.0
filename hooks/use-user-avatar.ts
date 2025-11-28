import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export function useUserAvatar() {
  const { data: session } = useSession()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetch('/api/profile')
        .then(res => res.json())
        .then(userData => {
          setAvatarUrl(userData.avatarUrl || null)
          setLoading(false)
        })
        .catch(err => {
          console.error('Erro ao carregar avatar:', err)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [session])

  return { avatarUrl, loading }
}

