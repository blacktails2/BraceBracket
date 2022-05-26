import { FC } from "react"
import { ControlPanel } from "../parts/ControlPanel"
import { useOrigin } from "../../../hooks/useOrigin"
import { useRouter } from "next/router"
import { PrimaryButton } from "../../parts/PrimaryButton"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { FormProvider, useForm } from "react-hook-form"
import { useLoadBracket } from "../../../hooks/useLoadBracket"

export const Top8Bracket: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [_, requestLoad] = useLoadBracket(id)
  const bracketForm = useForm<{ phaseGroupId: number }>()
  const { handleSubmit } = bracketForm
  const onSubmit = ({ phaseGroupId }: { phaseGroupId: number }) => {
    requestLoad(phaseGroupId)
  }
  return (
    <ControlPanel title="Top8" url={`${origin}/obs/bracket?id=${id}`}>
      <FormProvider {...bracketForm}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <hr />
          <PrimaryButton type="submit">start.ggから情報を取得</PrimaryButton>
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
