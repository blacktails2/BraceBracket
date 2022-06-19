import { FC, memo, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"

import { LoadBracket } from "../../../libs/const"
import { Button } from "../../parts/Button"
import { CheckBoxForm } from "../../parts/CheckBoxForm"

const Top8Bracket: FC<{
  loadBracket: LoadBracket
  requestLoad: (autoUpdate: boolean) => void
}> = ({ loadBracket, requestLoad }) => {
  const form = useForm<{ autoUpdate: boolean }>()
  const { handleSubmit } = form
  useEffect(() => {
    form.setValue("autoUpdate", loadBracket.autoUpdate)
  }, [loadBracket, form])

  const onSubmit = ({ autoUpdate }: { autoUpdate: boolean }) => {
    requestLoad(autoUpdate)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-[60rem] flex-col justify-center gap-[0.5rem]">
            <Button type="submit" mode="small">
              start.ggから情報を取得
            </Button>
            <CheckBoxForm label="自動で更新する" name="autoUpdate" />
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default memo(Top8Bracket)
