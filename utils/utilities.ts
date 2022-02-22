import { useMeta } from '@nuxtjs/composition-api'
import axios, { AxiosError } from 'axios'
import { Meta } from '~/types'

/**
 * エラーメッセージ一覧（エラーメッセージ）
 */
const EXCEPTION_ERROR_MESSAGE = 'システムエラーにより処理が失敗しました。時間を置いて再度お試しください。'

/**
 * 正の全角整数を半角整数に変換する。また、数値以外の文字や記号も取り除く。
 */
export const convertToHalfWidthInteger = (str: string | number, maxNumber: number, allowZero = true): number | null => {
  // 全角数値を半角数値に変換する
  const convertValue = String(str).replace(/[０-９]/g, (s: string) => {
    return String.fromCharCode(s.charCodeAt(0) - 65248).replace(/[^0-9]/g, '')
  })

  // 0以上の整数に合致するかどうかを判別する
  if (!convertValue.match(/^[1-9]\d*$|^0$/)) return null

  // 値の検証を行う
  const convertNumber = Number(convertValue)
  if (!allowZero && convertNumber === 0) return null
  if (convertNumber > maxNumber) return maxNumber

  return convertNumber
}

/**
 * try/catchのcatch内で使用。エラーメッセージを配列にして返す。
 */
export const exceptionErrorToArray = (error: unknown, expectedStatusCodes: number[] = []): string[] => {
  if (
    !axios.isAxiosError(error) ||
    (expectedStatusCodes.length && !expectedStatusCodes.includes(error.response?.status ?? 500))
  ) {
    return [EXCEPTION_ERROR_MESSAGE]
  }
  return formatAxiosError(error.response?.data.errors)
}

/**
 * Axiosのエラーを配列にして返す
 */
export const formatAxiosError = (errorsResponse: AxiosError): string[] => {
  const errorList: string[] = []
  if (!errorsResponse) return errorList
  Object.values(errorsResponse).forEach((errors) => {
    errorList.push(errors[0])
  })
  return errorList
}

/**
 * 小数点を切り捨てる、また、nullや負の数には初期値を返していく
 */
export const numberToInt = (value: number | null, defaultValue = 0): number => {
  if (String(value) === '' || Number(value) < defaultValue) {
    return defaultValue
  } else {
    return Math.floor(Number(value))
  }
}

/**
 * メタタグを設定する
 */
export const updateMeta = (_meta: Meta) => {
  const { title, meta } = useMeta()
  title.value = _meta.title
  meta.value = [
    { hid: 'og:title', name: 'og:title', content: _meta.title },
    { hid: 'twitter:title', name: 'twitter:title', content: _meta.title },
    { hid: 'description', name: 'description', content: _meta.description },
    { hid: 'og:description', name: 'og:description', content: _meta.description },
    { hid: 'twitter:description', name: 'twitter:description', content: _meta.description },
  ]
}

/**
 * 代入する値を検証して返す
 */
export const valueVerification = (value: number, max: number): number | null => {
  if (value > max) return max
  if (value <= 0) return null
  return Math.floor(value)
}
