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
          <div className="flex gap-[0.5rem] flex-col w-full max-w-[60rem] justify-center">
            <CheckBoxForm label="自動で情報を更新" name="autoUpdate" />
            <Button type="submit">start.ggから情報を取得</Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default memo(Top8Bracket)
