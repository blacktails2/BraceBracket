import { FC, useEffect } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { useOrigin } from "../../../hooks/useOrigin"
import { MC as FormType } from "../../../libs/const"
import { PrimaryButton } from "../../parts/PrimaryButton"
import { TextForm } from "../../parts/TextForm"
import { ControlPanel } from "../parts/ControlPanel"

export const MC: FC<{
  id?: string
  mc?: FormType
  setMC: (value: FormType) => void
  loading: boolean
}> = ({ id, mc, setMC, loading }) => {
  const origin = useOrigin()
  const form = useForm<FormType>()
  const { fields } = useFieldArray({
    control: form.control,
    name: "mcList",
  })

  const onSubmit = (data: FormType) => {
    setMC(data)
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
          <div className="flex flex-wrap gap-[30px]">
            {fields.map((field, idx) => {
              return (
                <div key={field.id}>
                  <h4>{idx + 1}人目のMC情報</h4>
                  <div className="flex gap-[10px]">
                    <TextForm
                      label="チーム名"
                      name={`mcList.${idx}.team`}
                      placeholder="Team"
                      className="w-[80px]"
                    />
                    <TextForm
                      label="MC名"
                      name={`mcList.${idx}.playerName`}
                      placeholder="MCName"
                      className="w-[150px]"
                    />
                    <TextForm
                      label="Twitter ID"
                      name={`mcList.${idx}.twitterID`}
                      placeholder="@user_name"
                      className="w-[150px]"
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <PrimaryButton type="submit" className="mt-[30px] w-[194px]" full>
            適用する
          </PrimaryButton>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}
