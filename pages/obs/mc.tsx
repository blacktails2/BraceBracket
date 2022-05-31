import { NextPage } from "next"
import { useRouter } from "next/router"
import { MC } from "../../components/obs/mc/MC"
import { useMC } from "../../hooks/useMC"
import { useSetting } from "../../hooks/useSetting"

const Page: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting] = useSetting(id)
  const [mc] = useMC(id)

  if (!setting || !mc) {
    return null
  }

  return <MC setting={setting} mc={mc} />
}

export default Page
