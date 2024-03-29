import Image from "next/image"
import { Controller, useFormContext } from "react-hook-form"

import { DesignRadioButton } from "../parts/DesignRadioButton"

import styles from "./DropShadow.module.scss"

export const DropShadow = () => {
  const { control } = useFormContext()
  return (
    <div className={styles.container}>
      <h4>ロゴにドロップシャドウを追加する</h4>
      <p>ドロップシャドウをつけてロゴの視認性を向上できます。</p>
      <div className={styles.options}>
        <Controller
          name="scoreboard.cameraAndLogo.dropShadow"
          control={control}
          render={({ field }) => {
            return (
              <>
                <DesignRadioButton
                  field={field}
                  label="シャドウなし"
                  value="none"
                  imageSrc={
                    <div
                      className="rounded-[5px] py-[25px] px-[42px]"
                      style={{
                        backgroundColor: "rgb(0 0 0 / 10%)",
                      }}
                    >
                      <Image
                        src="/image/symbol.svg"
                        width={110}
                        height={53}
                        alt="symbol"
                      />
                    </div>
                  }
                />
                <DesignRadioButton
                  field={field}
                  label="シャドウ（白）"
                  value="light"
                  imageSrc={
                    <div
                      className="rounded-[5px] py-[25px] px-[42px]"
                      style={{
                        backgroundColor: "rgb(0 0 0 / 40%)",
                        filter: "drop-shadow(0 0 6px rgb(255 255 255 / 70%))",
                      }}
                    >
                      <Image
                        src="/image/symbol.svg"
                        width={110}
                        height={53}
                        alt="symbol"
                        className="fill-black"
                      />
                    </div>
                  }
                />
                <DesignRadioButton
                  field={field}
                  label="シャドウ（黒）"
                  value="dark"
                  imageSrc={
                    <div
                      className="rounded-[5px] py-[25px] px-[42px]"
                      style={{
                        backgroundColor: "rgb(0 0 0 / 10%)",
                        filter: "drop-shadow(0 0 4px rgb(0 0 0 / 30%))",
                      }}
                    >
                      <Image
                        src="/image/symbol.svg"
                        width={110}
                        height={53}
                        alt="symbol"
                        className="fill-black"
                      />
                    </div>
                  }
                />
              </>
            )
          }}
        />
      </div>
    </div>
  )
}
