import { set } from "@firebase/database"
import cryptoRandomString from "crypto-random-string"
import { child, get, ref, serverTimestamp, update } from "firebase/database"
import { useRouter } from "next/router"
import { FC, useEffect, useMemo } from "react"
import {
  FieldErrors,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form"

import { Setting } from "../../libs/const"
import { db } from "../../libs/firebase"
import { TextForm } from "../control2/parts/TextForm"
import { Button } from "../parts/Button"

import styles from "./create.module.scss"
import { Preview } from "./parts/Preview"
import { Color } from "./settingForms/Color"
import { DisplayCameraAndTwitterID } from "./settingForms/DisplayCameraAndTwitterID"
import { DropShadow } from "./settingForms/DropShadow"
import { IntegrateStartGG } from "./settingForms/IntegrateStartGG"
import { Layout } from "./settingForms/Layout"
import { SelectLogo } from "./settingForms/SelectLogo"
import { UseLogo } from "./settingForms/UseLogo"

const getErrorMessages = (errors: FieldErrors): string[] => {
  return Object.values(errors)
    .flatMap((error): string | string[] => {
      if (error.message && typeof error.message === "string") {
        return error.message
      }

      if (typeof error === "object") {
        return getErrorMessages(error)
      }

      return ""
    })
    .filter((message) => message !== "")
}
export const Create: FC<{ setting: Setting }> = ({ setting }) => {
  const router = useRouter()
  const id = router.query.id as string
  const createForm = useForm<Setting>({
    defaultValues: setting,
  })
  createForm.watch("scoreboard.design.layout")
  createForm.watch("scoreboard.cameraAndLogo.useLogo")
  const {
    formState: { errors },
  } = createForm
  const submitText = useMemo(() => {
    if (id) {
      return "スコアボードを更新"
    }
    return "スコアボードを作成"
  }, [id])
  const onCreateSubmit: SubmitHandler<Setting> = async (data) => {
    console.log(createForm.formState.errors)
    let _id
    if (!id) {
      _id = cryptoRandomString({ length: 32, type: "alphanumeric" })
    } else {
      _id = id
    }
    const rootRef = ref(db, `tournaments/${_id}`)
    if ((await get(rootRef)).exists()) {
      update(child(rootRef, "setting"), data)
    } else {
      set(rootRef, {
        createdAt: serverTimestamp(),
        setting: data,
      })
    }

    await router.push({
      pathname: `/links`,
      query: { id: _id },
    })
  }

  useEffect(() => {
    if (!createForm || !setting) return
    createForm.reset(setting)
  }, [createForm, setting])

  return (
    <form onSubmit={createForm.handleSubmit(onCreateSubmit)}>
      <div className={styles.container}>
        <FormProvider {...createForm}>
          <div className={styles.settingFormContainer}>
            <h2>{submitText}</h2>
            <h3>デザイン</h3>
            <Layout />
            <Color
              selectedLayout={createForm.getValues("scoreboard.design.layout")}
            />
            <hr />
            <h3>カメラ・大会設定</h3>
            <div className="mb-[5rem]">
              <h4 className="mb-[0.5rem]">大会名</h4>
              <p className="mb-[1rem]">
                Dualレイアウトでロゴ画像を設定していない場合、大会名がスコアボード中央に表示されます。
              </p>
              <TextForm name="name" placeholder="CompetitionName" />
            </div>
            <DisplayCameraAndTwitterID />
            <UseLogo />
            {createForm.getValues("scoreboard.cameraAndLogo.useLogo") && (
              <>
                <SelectLogo />
                <DropShadow />
              </>
            )}
            <hr />
            <h3>トーナメント管理ツール連携</h3>
            <IntegrateStartGG />
            <Button type="submit" mode="primary">
              {submitText}
            </Button>
            <div className="absolute">
              {getErrorMessages(errors).map((message) => {
                return (
                  <div
                    key={message}
                    className="text-[color:var(--bb-attention)]"
                  >
                    <p>{message}</p>
                  </div>
                )
              })}
            </div>
          </div>
          <Preview />
        </FormProvider>
      </div>
    </form>
  )
}
