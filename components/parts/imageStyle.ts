import { CSSProperties } from "react"

/**
 * next/legacy/image（layout="intrinsic"）と同じ表示にするための next/image 用スタイル
 *
 * 旧コンポーネントは画像を display: inline-block; position: relative; max-width: 100% の
 * span で包み、その中で画像を指定した width / height の比率の枠いっぱいに表示していた。
 * - inline-block / vertical-align: baseline: 行内に配置される（下にわずかな余白ができる）。
 *   Tailwind の preflight が img に付ける display: block / vertical-align: middle を打ち消す
 * - position: relative: 先に置いた position: absolute の画像より手前に描画される
 * - max-width: 100% / height: auto / aspect-ratio: 親要素に収まるよう、
 *   指定した width / height の比率を保って縮小する（画像本来の比率ではない）
 * - margin / padding / border: 旧コンポーネントはインラインスタイルで打ち消していたため、
 *   .markdown img などのCSSの余白・枠線は効かない（border-radius などは効く）
 */
export const intrinsicImageStyle = (
  width: number,
  height: number
): CSSProperties => ({
  display: "inline-block",
  position: "relative",
  verticalAlign: "baseline",
  maxWidth: "100%",
  height: "auto",
  aspectRatio: `${width} / ${height}`,
  margin: 0,
  padding: 0,
  border: "none",
})
