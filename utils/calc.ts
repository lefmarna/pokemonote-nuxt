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
 * 小数点を切り捨てる、また、nullや負の数には初期値を返していく
 */
export const numberToInt = (value: number, defaultValue = 0): number => {
  if (String(value) === '' || value < defaultValue) {
    return defaultValue
  } else {
    return Math.floor(value)
  }
}

/**
 * 代入する値を検証して返す
 */
export const valueVerification = (value: number, max: number): number | null => {
  if (value > max) return max
  if (value <= 0) return null
  return Math.floor(value)
}
