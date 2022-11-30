import { FC, memo, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

import { Telop as TelopType } from "../../../libs/const"
import { Button } from "../../parts/Button"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { TextForm } from "../parts/TextForm"

const Telop: FC<{
  telop: TelopType
  setTelop: (telop: TelopType) => void
}> = ({ telop, setTelop }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const form = useForm<TelopType>()
  const { handleSubmit } = form
  useEffect(() => {
    form.reset(telop)
  }, [telop, form])

  const onSubmit = (data: TelopType) => {
    setTelop(data)
    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 3000)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
              <CheckBoxForm
                label="テロップを非表示"
                name="isHide"
                cleanValue={telop.isHide}
              />
              <CheckBoxForm
                label="テロップを下側に表示"
                name="isBottom"
                cleanValue={telop.isBottom}
              />
            </div>
            <hr className="my-[1rem] h-[1px] bg-[#c4c4c4]" />
            <div className="flex flex-col">
              <h6>TEXT</h6>
              <TextForm
                className="mb-2"
                name="text1"
                placeholder="インフォメーションを入力(1行目)"
                cleanValue={telop.text1}
              />
              <TextForm
                name="text2"
                placeholder="インフォメーションを入力(2行目)"
                cleanValue={telop.text2}
              />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default memo(Telop)
