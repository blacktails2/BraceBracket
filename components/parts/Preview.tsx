import Image from "next/image"
import { FC } from "react"

import {
  getBracketFilename,
  getCameraFilename,
  getMCFilename,
  getNextFilename,
} from "../../libs/const"
import styles from "../create/parts/Preview.module.scss"

import { intrinsicImageStyle } from "./imageStyle"

/**
 * デザイン（レイアウト・カラー）に応じて切り替わるプレビュー画像
 * 設定の読み込み前（layout / color が未確定）は存在しない画像を要求しないよう、同じ大きさの空白にする
 */
const DesignImage: FC<{
  src: string
  alt: string
  ready: boolean
  className?: string
}> = ({ src, alt, ready, className }) => {
  if (!ready) {
    return (
      <span
        className={className}
        style={{ ...intrinsicImageStyle(340, 190), width: 340 }}
      />
    )
  }
  return (
    <Image
      src={src}
      width={340}
      height={190}
      className={className}
      alt={alt}
      style={intrinsicImageStyle(340, 190)}
    />
  )
}

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
          style={intrinsicImageStyle(340, 190)}
        />
      </div>
      {displayCameraAndTwitterID && (
        <div className="absolute z-10">
          <DesignImage
            src={`/image/create/samples/camera/${getCameraFilename(
              layout,
              color
            )}`}
            className="w-full rounded-lg"
            alt="カメラ"
            ready={!!layout && !!color}
          />
        </div>
      )}
      <DesignImage
        src={`/image/create/samples/layout/${layout}/${layout}_${color}.png`}
        alt="スコアボードプレビュー"
        ready={!!layout && !!color}
      />
    </div>
  )
}

export const PreviewInterval: FC<{
  layout?: string
  color?: string
  onMC?: boolean
}> = ({ layout, color, onMC }) => {
  return (
    <div className="relative w-full">
      <div className="absolute">
        <Image
          src="/image/create/samples/sample_image2.jpg"
          width={340}
          height={190}
          className="w-full rounded-lg"
          alt="カメラ"
          style={intrinsicImageStyle(340, 190)}
        />
      </div>
      {onMC && (
        <div className="absolute z-10">
          <DesignImage
            src={`/image/create/samples/mc/${getMCFilename(layout, color)}`}
            className="w-full rounded-lg"
            alt="MCプレビュー"
            ready={!!layout && !!color}
          />
        </div>
      )}
      <div className={styles.outer}>
        <DesignImage
          src={`/image/create/samples/next/${getNextFilename(layout, color)}`}
          alt="Nextプレビュー"
          ready={!!layout && !!color}
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
          style={intrinsicImageStyle(340, 190)}
        />
      </div>
      <div className={styles.outer}>
        <DesignImage
          src={`/image/create/samples/mc/${getMCFilename(layout, color)}`}
          alt="MCプレビュー"
          ready={!!layout && !!color}
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
          style={intrinsicImageStyle(340, 190)}
        />
      </div>
      <DesignImage
        src={`/image/create/samples/top8/${getBracketFilename(layout, color)}`}
        alt="Top8プレビュー"
        ready={!!layout && !!color}
      />
    </div>
  )
}
