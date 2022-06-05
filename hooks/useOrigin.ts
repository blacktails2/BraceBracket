import { useEffect, useState } from "react"

export const useOrigin = () => {
  const [origin, setOrigin] = useState("")
  useEffect(() => {
    setOrigin(location.origin)
  }, [])
  return origin
}
