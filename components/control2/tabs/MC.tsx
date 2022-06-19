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
        <div className="flex justify-center w-full">
          <div className="flex flex-col gap-[1rem] justify-center w-full max-w-[55rem]">
            <div className="flex relative gap-[1rem] mb-[1rem]">
              <Button
                type="submit"
                mode="small"
                tooltipText="適用されました"
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
            <div className="flex flex-wrap gap-[1rem] w-full">
              {fields.map((field, idx) => {
                return (
                  <div key={field.id}>
                    <div className="text-[1rem] font-bold">MC NO.{idx + 1}</div>
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
