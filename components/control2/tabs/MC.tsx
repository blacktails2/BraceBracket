import { FC, memo, useEffect, useState } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"

import { MC as FormType } from "../../../libs/const"
import { Button } from "../../parts/Button"
import { TextForm } from "../parts/TextForm"

const MC: FC<{
  mc: FormType
  setMC: (mc: FormType) => void
}> = ({ mc, setMC }) => {
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
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full justify-center">
          <div className="flex gap-[2rem] flex-col w-full max-w-[60rem] justify-center">
            <div className="relative flex gap-[1rem]">
              <Button
                type="submit"
                mode="normal"
                full
                className="w-[12rem]"
                tooltipText="適用されました"
                showTooltip={showTooltip}
              >
                適用する
              </Button>
              <Button
                type="button"
                mode="normal"
                className="w-[12rem]"
                full
                light
                onClick={() => {
                  form.reset()
                }}
              >
                変更をリセット
              </Button>
            </div>
            <div className="flex flex-wrap w-full gap-[1rem]">
              {fields.map((field, idx) => {
                return (
                  <div key={field.id}>
                    <h4>{idx + 1}人目のMC情報</h4>
                    <div className="flex flex-wrap gap-[1rem]">
                      <TextForm
                        name={`mcList.${idx}.team`}
                        placeholder="Team"
                        className="w-[8rem]"
                        cleanValue={mc?.mcList[idx].team}
                      />
                      <TextForm
                        name={`mcList.${idx}.playerName`}
                        placeholder="MCName"
                        className="w-[15rem]"
                        cleanValue={mc?.mcList[idx].playerName}
                      />
                      <TextForm
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
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default memo(MC)
