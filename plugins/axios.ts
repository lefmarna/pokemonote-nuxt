import { Context } from '@nuxt/types'
import { AxiosError, AxiosResponse } from 'axios'

export default function ({ $axios, redirect }: Context) {
  $axios.onRequestError((error: AxiosError) => {
    console.log(error)
  })

  $axios.onResponse((response: AxiosResponse) => {
    // 成功レスポンスを受け取った時に呼び出されるコード
    console.log(response)
  })

  $axios.onError((error: AxiosError) => {
    // console.log(error)

    if (!error.response) {
      // エラーレスポンスがない、net::ERR_CONNECTION_REFUSEDなどは、ここで処理する
      redirect('/500')
    }

    if (error.response!.status === 401) {
      // 認証エラーは、ログイン画面へリダイレクトする
      redirect('/login')
    }

    if (error.response!.status === 500) {
      // サーバ内部エラーの場合は、ソーリページへ移動する
      redirect('/500')
    }
  })
}
