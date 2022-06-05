import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"

import { useMC } from "../../../hooks/useMC"
import { useOrigin } from "../../../hooks/useOrigin"
import { MC as FormType } from "../../../libs/const"
import { PrimaryButton } from "../../parts/PrimaryButton"
import { TextForm } from "../../parts/TextForm"
import { ControlPanel } from "../parts/ControlPanel"

export const MC: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [mc, setMC, loading] = useMC(id)
  const [showTooltip, setShowTooltip] = useState(false)
  const form = useForm<FormType>()
  const { fields } = useFieldArray({
    control: form.control,
    name: "mcList",
  })

  const onSubmit = (data: FormType) => {
    setMC(data)
    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 3000)
  }

  useEffect(() => {
    if (!loading && mc) {
      console.log(mc)
      form.reset(mc)
    }
  }, [mc, loading, form])

  return (
    <ControlPanel title="MC" url={`${origin}/obs/mc/?id=${id}`}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <hr />
          <div className="flex flex-wrap gap-[3rem]">
            {fields.map((field, idx) => {
              return (
                <div key={field.id}>
                  <h4>{idx + 1}人目のMC情報</h4>
                  <div className="flex flex-wrap gap-[1rem]">
                    <TextForm
                      label="チーム名"
                      name={`mcList.${idx}.team`}
                      placeholder="Team"
                      className="w-[8rem]"
                      cleanValue={mc?.mcList[idx].team}
                    />
                    <TextForm
                      label="MC名"
                      name={`mcList.${idx}.playerName`}
                      placeholder="MCName"
                      className="w-[15rem]"
                      cleanValue={mc?.mcList[idx].playerName}
                    />
                    <TextForm
                      label="Twitter ID"
                      name={`mcList.${idx}.twitterID`}
                      placeholder="@user_name"
                      className="w-[15rem]"
                      cleanValue={mc?.mcList[idx].twitterID}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-[2rem]">
            <PrimaryButton
              type="submit"
              className="mt-[3rem] w-[19rem]"
              full
              tooltipText="適用されました"
              showTooltip={showTooltip}
            >
              適用する
            </PrimaryButton>
            <PrimaryButton
              type="button"
              className="w-[19rem] mt-[3rem]"
              full
              light
              onClick={() => {
                form.reset()
              }}
            >
              変更をリセット
            </PrimaryButton>
          </div>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}
