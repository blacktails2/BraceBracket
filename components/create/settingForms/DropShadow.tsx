import styles from "./DropShadow.module.scss"
import { DesignRadioButton } from "../parts/DesignRadioButton"
import { Controller, useFormContext } from "react-hook-form"
import Image from "next/image"

export const DropShadow = () => {
  const { control } = useFormContext()
  return (
    <div className={styles.container}>
      <h4>ロゴにドロップシャドウを追加する</h4>
      <p>ドロップ車道をつけてロゴの視認性を向上できます。</p>
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
                      className="pt-[25px] pb-[25px] pl-[42px] pr-[42px]"
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
                      className="pt-[25px] pb-[25px] pl-[42px] pr-[42px]"
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
                      className="pt-[25px] pb-[25px] pl-[42px] pr-[42px]"
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
