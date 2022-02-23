import { shallowMount } from '@vue/test-utils'
import FormTemplate from '@/components/templates/FormTemplate'

describe('FormTemplateの正常系テスト', () => {
  it('propsの値が正しいこと', () => {
    const title = 'タイトル'
    const buttonText = 'ボタン'
    const errors = ['エラー1', 'エラー2', 'エラー3']
    const wrapper = shallowMount(FormTemplate, {
      propsData: {
        title,
        buttonText,
        errors,
      },
    })
    expect(wrapper.props().title).toBe(title)
    expect(wrapper.props().buttonText).toBe(buttonText)
    expect(wrapper.props().errors).toBe(errors)
  })
})
