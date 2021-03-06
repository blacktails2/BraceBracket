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
          <div className="flex w-full max-w-[55rem] flex-col justify-center gap-[1rem]">
            <div className="relative mb-[1rem] flex gap-[1rem]">
              <Button
                type="submit"
                mode="small"
                tooltipText="Changed!"
                showTooltip={showTooltip}
              >
                適用する
              </Button>
              <Button
                type="button"
                mode="small"
                light
                onClick={() => {
                  form.reset()
                }}
              >
                変更をリセット
              </Button>
            </div>
            <div className="flex w-full flex-wrap gap-[1rem]">
              {fields.map((field, idx) => {
                return (
                  <div key={field.id}>
                    <h6 className="mb-[0.2rem]">MC NO.{idx + 1}</h6>
                    <div className="flex flex-wrap gap-[0.5rem]">
                      <TextForm
                        name={`mcList.${idx}.team`}
                        placeholder="Team"
                        className="basis-[20%]"
                        cleanValue={mc?.mcList[idx].team}
                      />
                      <TextForm
                        name={`mcList.${idx}.playerName`}
                        placeholder="MC Name"
                        className="basis-[38%]"
                        cleanValue={mc?.mcList[idx].playerName}
                      />
                      <TextForm
                        name={`mcList.${idx}.twitterID`}
                        placeholder="@TwitterID"
                        className="basis-[38%]"
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
