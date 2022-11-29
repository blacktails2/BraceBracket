import { FC, useCallback, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"

import { IntegrateOBS } from "../../libs/const"
import { TextForm } from "../control2/parts/TextForm"
import { Button } from "../parts/Button"

export const Connect: FC<{
  connect: (url: string, password: string) => void
  integrateOBS: IntegrateOBS
  setIntegrateOBS: (integrateOBS: IntegrateOBS) => void
}> = ({ connect, integrateOBS, setIntegrateOBS }) => {
  const form = useForm<{ url: string; password: string }>({
    defaultValues: {
      url: "ws://localhost:4444",
      password: "password",
    },
  })
  const onSubmit = useCallback(
    (data: { url: string; password: string }) => {
      connect(data.url, data.password)
    },
    [connect]
  )
  useEffect(() => {
    console.log({ integrateOBS })
  }, [integrateOBS])

  return (
    <div className="flex h-[100vh] flex-col overflow-y-hidden py-[1.5rem] px-[2rem]">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-[1rem]">
            <div>
              <h6>URL</h6>
              <TextForm name="url" placeholder="ws://localhost:4444" />
            </div>
            <div>
              <h6>Password</h6>
              <TextForm name="password" placeholder="" />
            </div>
            <div>
              <Button mode="small" type="submit">
                接続
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
      <hr className="my-[1rem] h-[1px] bg-[#c4c4c4]" />
      <div>接続状況：{integrateOBS.state.connected ? "接続中" : "未接続"}</div>
      <div>現在のシーン：{integrateOBS.state.currentScene}</div>
      <div>
        {(integrateOBS.state.sceneList || []).map((scene) => {
          return (
            <div
              key={scene}
              className={`ease delay-50 rounded-[5px] border-[1px] border-solid border-[#c4c4c4] px-[0.5rem] transition hover:border-[#202025] hover:shadow-md${
                integrateOBS.state.currentScene === scene
                  ? "border-[#202025] bg-[#202025] text-white"
                  : "bg-white text-[#202025]"
              }`}
              onClick={() => {
                if (integrateOBS.state.currentScene !== scene) {
                  try {
                    setIntegrateOBS({
                      ...integrateOBS,
                      operation: {
                        queue: (integrateOBS.operation?.queue ?? []).concat([
                          {
                            type: "changeScene",
                            scene: scene,
                          },
                        ]),
                      },
                    })
                  } catch (e) {
                    console.error(e)
                  }
                }
              }}
            >
              {scene}
            </div>
          )
        })}
      </div>
    </div>
  )
}
