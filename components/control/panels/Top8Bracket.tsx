import { useRouter } from "next/router"
import { FC, memo, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"

import { useOrigin } from "../../../hooks/useOrigin"
import { LoadBracket } from "../../../libs/const"
import { Button } from "../../parts/Button"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { PrimaryButton } from "../../parts/PrimaryButton"
import { ControlPanel } from "../parts/ControlPanel"

const Top8Bracket: FC<{
  loadBracket: LoadBracket
  requestLoad: (autoUpdate: boolean) => void
}> = ({ loadBracket, requestLoad }) => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()

  const bracketForm = useForm<{ autoUpdate: boolean }>()
  const { handleSubmit } = bracketForm
  useEffect(() => {
    bracketForm.setValue("autoUpdate", loadBracket.autoUpdate)
  }, [loadBracket, bracketForm])

  const onSubmit = ({ autoUpdate }: { autoUpdate: boolean }) => {
    requestLoad(autoUpdate)
  }

  return (
    <ControlPanel title="Top8" url={`${origin}/obs/bracket/?id=${id}`}>
      <FormProvider {...bracketForm}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <hr />
          <Button type="submit">start.ggから情報を取得</Button>
          <CheckBoxForm
            label="自動で情報を更新"
            name="autoUpdate"
            className="mt-[10px]"
          />
          <div className="flex gap-[2rem]">
            <PrimaryButton type="submit" className="mt-[30px] w-[194px]" full>
              適用する
            </PrimaryButton>
          </div>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}

export default memo(Top8Bracket)
