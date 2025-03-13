import Document, { Head, Html, Main, NextScript } from "next/document"
import Script from "next/script"

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon.png" />
          <link
            rel="stylesheet"
            href="https://use.typekit.net/mze3wmm.css"
          ></link>
          <link
            rel="stylesheet"
            href="https://api.fontshare.com/css?f[]=satoshi@1,2&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700;900&display=swap"
          />
          <Script
            src="https://webfont.fontplus.jp/accessor/script/fontplus.js?qdfWifIcjAc%3D&box=PeMTC~FUu4w%3D&chws=1&aa=1&ab=1"
            strategy="beforeInteractive"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
