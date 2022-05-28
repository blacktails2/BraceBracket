import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { NextPageWithLayout, Setting } from "../libs/const"
import { DefaultLayout } from "../components/layouts/DefaultLayout"
import styles from "./create.module.scss"
import { PrimaryButton } from "../components/parts/PrimaryButton"
import { Layout } from "../components/create/settingForms/Layout"
import { Color } from "../components/create/settingForms/Color"
import { DisplayCameraAndTwitterID } from "../components/create/settingForms/DisplayCameraAndTwitterID"
import { UseLogo } from "../components/create/settingForms/UseLogo"
import { SelectLogo } from "../components/create/settingForms/SelectLogo"
import { DropShadow } from "../components/create/settingForms/DropShadow"
import cryptoRandomString from "crypto-random-string"
import { child, get, ref, serverTimestamp, update } from "firebase/database"
import { db } from "../libs/firebase"
import { set } from "@firebase/database"
import { useRouter } from "next/router"
import { useSetting } from "../hooks/useSetting"
import { useEffect, useMemo } from "react"
import { IntegrateStartGG } from "../components/create/settingForms/IntegrateStartGG"
import { Preview } from "../components/create/parts/Preview"

const Create: NextPageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting] = useSetting(id)
  const createForm = useForm<Setting>({
    defaultValues: setting,
  })
  createForm.watch("scoreboard.design.layout")
  const submitText = useMemo(() => {
    if (id) {
      return "スコアボードを更新"
    }
    return "スコアボードを作成"
  }, [id])
  const onCreateSubmit: SubmitHandler<Setting> = async (data) => {
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
            <SelectLogo />
            <DropShadow />
            <hr />
            <h3>トーナメント管理ツール連携</h3>
            <IntegrateStartGG />
            <PrimaryButton type="submit">{submitText}</PrimaryButton>
          </div>
          <Preview />
        </FormProvider>
      </div>
    </form>
  )
}

Create.getLayout = (page) => {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Create