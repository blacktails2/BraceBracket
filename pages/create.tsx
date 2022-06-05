import { set } from "@firebase/database"
import cryptoRandomString from "crypto-random-string"
import { child, get, ref, serverTimestamp, update } from "firebase/database"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import {
  FieldErrors,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form"

import { Preview } from "../components/create/parts/Preview"
import { Color } from "../components/create/settingForms/Color"
import { DisplayCameraAndTwitterID } from "../components/create/settingForms/DisplayCameraAndTwitterID"
import { DropShadow } from "../components/create/settingForms/DropShadow"
import { IntegrateStartGG } from "../components/create/settingForms/IntegrateStartGG"
import { Layout } from "../components/create/settingForms/Layout"
import { SelectLogo } from "../components/create/settingForms/SelectLogo"
import { UseLogo } from "../components/create/settingForms/UseLogo"
import { DefaultLayout } from "../components/layouts/DefaultLayout"
import { PrimaryButton } from "../components/parts/PrimaryButton"
import { useSetting } from "../hooks/useSetting"
import { NextPageWithLayout, Setting } from "../libs/const"
import { db } from "../libs/firebase"

import styles from "./create.module.scss"

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

const Create: NextPageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting] = useSetting(id)
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
      pathname: `/control`,
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
            <h3>カメラ・ロゴ設定</h3>
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
            <PrimaryButton type="submit">{submitText}</PrimaryButton>
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

Create.getLayout = (page) => {
  return (
    <>
      <Head>
        <title>BraceBracket | Setting</title>
      </Head>
      <DefaultLayout>{page}</DefaultLayout>
    </>
  )
}

export default Create
