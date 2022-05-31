import { FC, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useOrigin } from "../../../hooks/useOrigin"
import { LoadBracket } from "../../../libs/const"
import { Button } from "../../parts/Button"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { PrimaryButton } from "../../parts/PrimaryButton"
import { ControlPanel } from "../parts/ControlPanel"

export const Top8Bracket: FC<{
  id?: string
  loadBracket?: LoadBracket
  requestLoad: (autoUpdate: boolean) => void
  loading: boolean
}> = ({ id, loadBracket, requestLoad, loading }) => {
  const origin = useOrigin()
  const bracketForm = useForm<{ autoUpdate: boolean }>()
  const { handleSubmit } = bracketForm
  const onSubmit = ({ autoUpdate }: { autoUpdate: boolean }) => {
    requestLoad(autoUpdate)
  }

  useEffect(() => {
    if (!loading && loadBracket) {
      bracketForm.setValue("autoUpdate", loadBracket.autoUpdate)
    }
  }, [loading, loadBracket, bracketForm])
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
          <PrimaryButton type="submit" className="mt-[30px] w-[194px]" full>
            適用する
          </PrimaryButton>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}
