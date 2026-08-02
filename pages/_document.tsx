import Document, { Head, Html, Main, NextScript } from "next/document"
import Script from "next/script"

const TYPEKIT_KIT_ID = "azn2pjg"

// Typekit(Adobe Fonts)の非同期ローダー。html要素にwf-loading/wf-inactiveを付けるため、
// 描画前に同期実行する必要がありnext/scriptではなく素のinline scriptとして埋め込む。
const typekitLoader = `(function (d) {
  var config = { kitId: "${TYPEKIT_KIT_ID}", scriptTimeout: 3000, async: true },
    h = d.documentElement,
    t = setTimeout(function () {
      h.className = h.className.replace(/\\bwf-loading\\b/g, "") + " wf-inactive";
    }, config.scriptTimeout),
    tk = d.createElement("script"),
    f = false,
    s = d.getElementsByTagName("script")[0],
    a;
  h.className += " wf-loading";
  tk.src = "https://use.typekit.net/" + config.kitId + ".js";
  tk.async = true;
  tk.onload = tk.onreadystatechange = function () {
    a = this.readyState;
    if (f || (a && a != "complete" && a != "loaded")) return;
    f = true;
    clearTimeout(t);
    try {
      Typekit.load(config);
    } catch (e) {}
  };
  s.parentNode.insertBefore(tk, s);
})(document);`

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon.png" />
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
          <script dangerouslySetInnerHTML={{ __html: typekitLoader }} />
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
