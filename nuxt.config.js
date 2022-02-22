import colors from 'vuetify/es5/util/colors'
import ja from 'vuetify/es5/locale/ja'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate(title) {
      if (!title) return 'Pokemonote'
      return `${title} | Pokemonote`
    },
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'ポケモンのステータスを計算・管理するためのWebアプリ『Pokemonote』へようこそ！ 素早さ計算機や剣盾に対応した種族値ランキングといったツールも公開しています。「シンプルで高機能」なツールにこだわって制作していますので、是非お試しください。',
      },
      { property: 'og:site_name', content: 'Pokemonote' },
      { property: 'og:type', content: 'website' },
      { hid: 'og:title', property: 'og:title', content: 'Pokemonote' },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'ポケモンのステータスを計算・管理するためのWebアプリ『Pokemonote』へようこそ！ 素早さ計算機や剣盾に対応した種族値ランキングといったツールも公開しています。「シンプルで高機能」なツールにこだわって制作していますので、是非お試しください。',
      },
      { property: 'og:image', content: 'https://pokemonote.com/twitter_card.jpg' },
      { hid: 'twitter:title', name: 'twitter:title', content: 'Pokemonote' },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content:
          'ポケモンのステータスを計算・管理するためのWebアプリ『Pokemonote』へようこそ！ 素早さ計算機や剣盾に対応した種族値ランキングといったツールも公開しています。「シンプルで高機能」なツールにこだわって制作していますので、是非お試しください。',
      },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@lefmarna' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [{ type: 'text/javascript', src: 'https://js.pay.jp/v1/' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/init.ts'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  // components: true,
  components: [
    {
      path: '@/components/',
      pathPrefix: false,
    },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/composition-api/module',
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.BASE_URL || 'http://localhost/api/v1',
    credentials: true,
  },

  publicRuntimeConfig: {
    analyticsTrackingId: process.env.ANALYTICS_TRACKING_ID || 'UA-*********-*',
    payjpPublicKey: process.env.PAYJP_PUBLIC_KEY || 'pk_test_************************',
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    lang: {
      locales: { ja },
      current: 'ja',
    },
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.blue.darken2,
          accent: colors.blue.accent1,
          secondary: colors.grey.darken3,
          info: colors.blue,
          warning: colors.amber.base,
          error: colors.red.accent2,
          success: colors.green,
          danger: colors.red.darken2,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
