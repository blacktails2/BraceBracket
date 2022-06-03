import { FC, useEffect } from "react"
import { ControlPanel } from "../parts/ControlPanel"
import { useOrigin } from "../../../hooks/useOrigin"
import { useRouter } from "next/router"
import { TextForm } from "../../parts/TextForm"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { PrimaryButton } from "../../parts/PrimaryButton"
import { MC as FormType } from "../../../libs/const"
import { useMC } from "../../../hooks/useMC"

export const MC: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [mc, setMC, loading] = useMC(id)
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
                    />
                    <TextForm
                      label="MC名"
                      name={`mcList.${idx}.playerName`}
                      placeholder="MCName"
                      className="w-[15rem]"
                    />
                    <TextForm
                      label="Twitter ID"
                      name={`mcList.${idx}.twitterID`}
                      placeholder="@user_name"
                      className="w-[15rem]"
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <PrimaryButton type="submit" className="mt-[3rem] w-[19rem]" full>
            適用する
          </PrimaryButton>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}
