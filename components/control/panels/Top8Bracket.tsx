import { FC, useEffect } from "react"
import { ControlPanel } from "../parts/ControlPanel"
import { useOrigin } from "../../../hooks/useOrigin"
import { useRouter } from "next/router"
import { PrimaryButton } from "../../parts/PrimaryButton"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { FormProvider, useForm } from "react-hook-form"
import { useLoadBracket } from "../../../hooks/useLoadBracket"
import { Button } from "../../parts/Button"

export const Top8Bracket: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [loadBracket, requestLoad, loading] = useLoadBracket(id)
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
