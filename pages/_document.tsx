import Document, { Html, Head, Main, NextScript } from 'next/document'

type Props = {}

export default class MyDocument extends Document<Props> {
  render() {
    const mapApiKey = process.env.MAP_API_KEY;
    return (
      <Html>
        <Head>
          <script
            async
            type="text/javascript"
            src={`//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${mapApiKey}`}
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
