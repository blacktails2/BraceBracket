import Image from "next/image"
import { FC } from "react"

import { customImage } from "../../custom/config"
import styles from "../create/parts/Preview.module.scss"

export const PreviewScore: FC<{
  displayCameraAndTwitterID?: boolean
}> = ({ displayCameraAndTwitterID }) => {
  return (
    <div className="relative w-full">
      <div className="absolute">
        <Image
          src="/image/create/samples/sample_image1.jpg"
          width={340}
          height={190}
          className="w-full rounded-lg"
          alt="カメラ"
        />
      </div>
      {displayCameraAndTwitterID && (
        <div className="absolute z-10">
          <Image
            src={customImage.camera}
            width={340}
            height={190}
            className="w-full rounded-lg"
            alt="カメラ"
          />
        </div>
      )}
      <Image
        src={customImage.scoreboard}
        width={340}
        height={190}
        alt="スコアボードプレビュー"
      />
    </div>
  )
}

export const PreviewInterval: FC<{
  onMC?: boolean
}> = ({ onMC }) => {
  return (
    <div className="relative w-full">
      <div className="absolute">
        <Image
          src="/image/create/samples/sample_image2.jpg"
          width={340}
          height={190}
          className="w-full rounded-lg"
          alt="カメラ"
        />
      </div>
      {onMC && (
        <div className="absolute z-10">
          <Image
            src={customImage.mc(2)}
            width={340}
            height={190}
            className="w-full rounded-lg"
            alt="MCプレビュー"
          />
        </div>
      )}
      <div className={styles.outer}>
        <Image
          src={customImage.next}
          width={340}
          height={190}
          alt="Nextプレビュー"
        />
      </div>
    </div>
  )
}

export const PreviewMC: FC = () => {
  return (
    <div className="relative w-full">
      <div className="absolute">
        <Image
          src="/image/create/samples/sample_image2.jpg"
          width={340}
          height={190}
          className="w-full rounded-lg"
          alt="カメラ"
        />
      </div>
      <div className={styles.outer}>
        <Image
          src={customImage.mc(2)}
          width={340}
          height={190}
          alt="MCプレビュー"
        />
      </div>
    </div>
  )
}

export const PreviewBracket: FC = () => {
  return (
    <div className="relative w-full">
      <div className="absolute">
        <Image
          src="/image/create/samples/sample_image2.jpg"
          width={340}
          height={190}
          className="w-full rounded-lg"
          alt="カメラ"
        />
      </div>
      <Image
        src={customImage.bracket}
        width={340}
        height={190}
        alt="Top8プレビュー"
      />
    </div>
  )
}
