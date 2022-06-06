import { useRouter } from "next/router"
import { FC, memo, useEffect, useState } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"

import { useOrigin } from "../../../hooks/useOrigin"
import { MC as FormType } from "../../../libs/const"
import { Button } from "../../parts/Button"
import { TextForm } from "../../parts/TextForm"
import { ControlPanel } from "../parts/ControlPanel"

const MC: FC<{
  mc: FormType
  setMC: (mc: FormType) => void
}> = ({ mc, setMC }) => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [showTooltip, setShowTooltip] = useState(false)
  const form = useForm<FormType>()
  const { fields } = useFieldArray({
    control: form.control,
    name: "mcList",
  })

  useEffect(() => {
    form.reset(mc)
  }, [form, mc])

  const onSubmit = (data: FormType) => {
    setMC(data)
    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 3000)
  }

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
            <Button
              type="submit"
              mode="primary"
              className="mt-[3rem] w-[19rem]"
              full
              tooltipText="適用されました"
              showTooltip={showTooltip}
            >
              適用する
            </Button>
            <Button
              type="button"
              mode="primary"
              className="w-[19rem] mt-[3rem]"
              full
              light
              onClick={() => {
                form.reset()
              }}
            >
              変更をリセット
            </Button>
          </div>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}

export default memo(MC)
