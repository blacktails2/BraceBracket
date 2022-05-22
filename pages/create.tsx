import type { NextPage } from "next"
import { SubmitHandler, useForm } from "react-hook-form"
import cryptoRandomString from "crypto-random-string"
import { useRouter } from "next/router"

const Create: NextPage = () => {
  const router = useRouter()
  const createForm = useForm<never>()
  const onCreateSubmit: SubmitHandler<never> = async () => {
    const id = cryptoRandomString({ length: 32, type: "alphanumeric" })
    await router.push(`/controll?id=${id}`)
  }

  return (
    <div>
      <form onSubmit={createForm.handleSubmit(onCreateSubmit)}>
        <div>
          <button type="submit">設定を作成する</button>
        </div>
      </form>
    </div>
  )
}

export default Create
