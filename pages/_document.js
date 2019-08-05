import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link href="/static/fonts/style.css?v1" rel="stylesheet" media="screen" />
          <link rel="manifest" href="/static/manifest.json" />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <meta name="theme-color" content="#ffffff" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,minimum-scale=1,shrink-to-fit=no"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
