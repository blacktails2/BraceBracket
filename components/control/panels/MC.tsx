import { FC } from "react"
import { ControlPanel } from "../parts/ControlPanel"
import { useOrigin } from "../../../hooks/useOrigin"
import { useRouter } from "next/router"
import { TextForm } from "../../parts/TextForm"
import { FormProvider, useForm } from "react-hook-form"
import { PrimaryButton } from "../../parts/PrimaryButton"

export const MC: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const form = useForm()

  return (
    <ControlPanel title="MC" url={`${origin}/obs/mc?id=${id}`}>
      <FormProvider {...form}>
        <form>
          <hr />
          <div className="flex flex-wrap gap-[30px]">
            <div>
              <h4>1人目のMC情報</h4>
              <div className="flex gap-[10px]">
                <TextForm
                  label="チーム名"
                  name="mc1.team"
                  placeholder="Team"
                  className="w-[80px]"
                />
                <TextForm
                  label="MC名"
                  name="mc1.name"
                  placeholder="MCName"
                  className="w-[150px]"
                />
                <TextForm
                  label="Twitter ID"
                  name="mc1.twitterID"
                  placeholder="@user_name"
                  className="w-[150px]"
                />
              </div>
            </div>
            <div>
              <h4>2人目のMC情報</h4>
              <div className="flex flex-wrap gap-[10px]">
                <TextForm
                  label="チーム名"
                  name="mc2.team"
                  placeholder="Team"
                  className="w-[80px]"
                />
                <TextForm
                  label="MC名"
                  name="mc2.name"
                  placeholder="MCName"
                  className="w-[150px]"
                />
                <TextForm
                  label="Twitter ID"
                  name="mc2.twitterID"
                  placeholder="@user_name"
                  className="w-[150px]"
                />
              </div>
            </div>
            <div>
              <h4>3人目のMC情報</h4>
              <div className="flex flex-wrap gap-[10px]">
                <TextForm
                  label="チーム名"
                  name="mc3.team"
                  placeholder="Team"
                  className="w-[80px]"
                />
                <TextForm
                  label="MC名"
                  name="mc3.name"
                  placeholder="MCName"
                  className="w-[150px]"
                />
                <TextForm
                  label="Twitter ID"
                  name="mc3.twitterID"
                  placeholder="@user_name"
                  className="w-[150px]"
                />
              </div>
            </div>
            <div>
              <h4>4人目のMC情報</h4>
              <div className="flex flex-wrap gap-[10px]">
                <TextForm
                  label="チーム名"
                  name="mc4.team"
                  placeholder="Team"
                  className="w-[80px]"
                />
                <TextForm
                  label="MC名"
                  name="mc4.name"
                  placeholder="MCName"
                  className="w-[150px]"
                />
                <TextForm
                  label="Twitter ID"
                  name="mc4.twitterID"
                  placeholder="@user_name"
                  className="w-[150px]"
                />
              </div>
            </div>
          </div>
          <PrimaryButton type="submit" className="mt-[30px] w-[194px]" full>
            適用する
          </PrimaryButton>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}
