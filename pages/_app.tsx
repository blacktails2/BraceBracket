import "../styles/globals.scss"
import Script from "next/script"
import { AppPropsWithLayout } from "../libs/const"

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      {(process.env.NODE_ENV === "production" ||
        process.env.LOAD_FONT === "ON") && (
        /* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */
        <Script
          src="https://webfont.fontplus.jp/accessor/script/fontplus.js?qdfWifIcjAc%3D&box=PeMTC~FUu4w%3D&chws=1&aa=1&ab=1"
          strategy="beforeInteractive"
          onLoad={() => {
            window.FONTPLUS.attachCompleteEvent((res: { code: number }) => {
              console.log(`fontplus loaded: ${res.code} glyphs`)
            })
          }}
        />
      )}
      {getLayout(<Component {...pageProps} />)}
    </>
  )
}

export default MyApp
