import { useMeta } from '@nuxtjs/composition-api'
import { Meta } from '~/types'

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
