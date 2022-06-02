import { NextPage } from "next"
import { useSetting } from "../../hooks/useSetting"
import { useRouter } from "next/router"
import { useMC } from "../../hooks/useMC"
import { MC } from "../../components/obs/mc/MC"

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
