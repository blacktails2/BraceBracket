import Image from "next/image"
import { FC } from "react"

import {
  getBracketFilename,
  getCameraFilename,
  getMCFilename,
  getNextFilename,
  getTelopFilename,
} from "../../libs/const"
import styles from "../create/parts/Preview.module.scss"

export const PreviewScore: FC<{
  displayCameraAndTwitterID?: boolean
  layout?: string
  color?: string
}> = ({ displayCameraAndTwitterID, layout, color }) => {
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
            src={`/image/create/samples/camera/${getCameraFilename(
              layout,
              color
            )}`}
            width={340}
            height={190}
            className="w-full rounded-lg"
            alt="カメラ"
          />
        </div>
      )}
      <Image
        src={`/image/create/samples/layout/${layout}/${layout}_${color}.png`}
        width={340}
        height={190}
        alt="スコアボードプレビュー"
      />
    </div>
  )
}

export const PreviewInterval: FC<{
  layout?: string
  color?: string
  onMC?: boolean
  onTelop?: boolean
}> = ({ layout, color, onMC, onTelop }) => {
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
            src={`/image/create/samples/mc/${getMCFilename(layout, color)}`}
            width={340}
            height={190}
            className="w-full rounded-lg"
            alt="MCプレビュー"
          />
        </div>
      )}
      {onTelop && (
        <div className="absolute z-10">
          <Image
            src={`/image/create/samples/telop/${getTelopFilename(
              layout,
              color,
              false
            )}`}
            width={340}
            height={190}
            className="w-full rounded-lg"
            alt="テロッププレビュー"
          />
        </div>
      )}
      <div className={styles.outer}>
        <Image
          src={`/image/create/samples/next/${getNextFilename(layout, color)}`}
          width={340}
          height={190}
          alt="Nextプレビュー"
        />
      </div>
    </div>
  )
}

export const PreviewMC: FC<{
  layout?: string
  color?: string
}> = ({ layout, color }) => {
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
          src={`/image/create/samples/mc/${getMCFilename(layout, color)}`}
          width={340}
          height={190}
          alt="MCプレビュー"
        />
      </div>
    </div>
  )
}

export const PreviewBracket: FC<{ layout?: string; color?: string }> = ({
  layout,
  color,
}) => {
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
        src={`/image/create/samples/top8/${getBracketFilename(layout, color)}`}
        width={340}
        height={190}
        alt="Top8プレビュー"
      />
    </div>
  )
}

export const PreviewTelop: FC<{
  layout?: string
  color?: string
}> = ({ layout, color }) => {
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
          src={`/image/create/samples/telop/${getTelopFilename(
            layout,
            color,
            false
          )}`}
          width={340}
          height={190}
          alt="テロッププレビュー"
        />
      </div>
    </div>
  )
}
