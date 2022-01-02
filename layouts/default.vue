<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-container>
        <v-divider />
        <v-list-item>Menu</v-list-item>
        <v-divider></v-divider>
        <v-list dense nav>
          <v-list-item
            v-for="siteMenuList in siteMenuLists"
            :key="siteMenuList.name"
            :to="siteMenuList.link"
            exact
          >
            <v-list-item-icon>
              <v-icon>{{ siteMenuList.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ siteMenuList.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- ログイン時のみマイページを表示する -->
          <v-list-item
            v-if="isLogin"
            :to="`/users/${getAuthUser.username}`"
            exact
          >
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>マイページ</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list-item>Tools</v-list-item>
        <v-divider />
        <v-list dense nav>
          <v-list-item v-for="tool in tools" :key="tool.name" :to="tool.link">
            <v-list-item-icon>
              <v-icon>{{ tool.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ tool.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list-item>Others</v-list-item>
        <v-divider />
        <v-list dense nav>
          <v-list-item
            v-for="otherMenuList in otherMenuListsFiltered"
            :key="otherMenuList.name"
            :to="otherMenuList.link"
          >
            <v-list-item-icon>
              <v-icon>{{ otherMenuList.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ otherMenuList.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list class="bottomFooter__copyright">
          © Copyright 2021 Pokemonote.
        </v-list>
      </v-container>
    </v-navigation-drawer>
    <!-- ヘッダーの設定 -->
    <v-app-bar app color="primary" dark>
      <!-- ヘッダー左側 -->
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>
        <router-link to="/"
          ><v-img
            alt="Pokemonote"
            class="shrink mt-2"
            contain
            :src="logoPath"
            transition="scale-transition"
            max-height="81"
            max-width="286"
        /></router-link>
      </v-toolbar-title>
      <v-spacer />
      <!-- ヘッダー右側 -->
      <v-toolbar-items v-if="isLogin">
        <v-btn text @click="logout">ログアウト</v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-else>
        <v-btn text to="/login">ログイン</v-btn>
        <v-btn text to="/register">新規登録</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <!-- <Alert id="notice" /> -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  provide,
  ref,
  useContext,
  useStore,
} from '@nuxtjs/composition-api'
import useAuthUser, { AuthUserKey, AuthUserStore } from '@/utils/useAuthUser'

export default defineComponent({
  setup() {
    const { $axios } = useContext()
    const store = useStore()

    const logoPath = computed(() => {
      return require('@/assets/logo.svg')
    })

    provide(AuthUserKey, useAuthUser())
    const { getAuthUser, isLogin } = inject(AuthUserKey) as AuthUserStore

    const drawer = ref()

    const siteMenuLists = computed(() => {
      return [
        {
          name: 'Home',
          icon: 'mdi-home',
          link: '/',
        },
        {
          name: 'みんなの投稿',
          icon: 'mdi-pokemon-go',
          link: '/pokemons',
        },
      ]
    })

    const tools = computed(() => {
      return [
        {
          name: 'ステータス計算機',
          icon: 'mdi-calculator',
          link: '/inspire',
        },
        {
          name: '素早さ計算機',
          icon: 'mdi-run-fast',
          link: '/calc-speed',
        },
        {
          name: '種族値ランキング',
          icon: 'mdi-finance',
          link: '/base-stats-ranking',
        },
      ]
    })

    const otherMenuLists = computed(() => {
      return [
        {
          name: 'チップを贈る',
          icon: 'mdi-heart',
          link: '/give-tip',
          requireAuth: true,
        },
        {
          name: '利用規約',
          icon: 'mdi-comment-alert',
          link: '/privacy-policy',
        },
        {
          name: 'お問い合わせ',
          icon: 'mdi-email',
          link: '/lefmarna_otoiawase',
        },
        {
          name: '設定',
          icon: 'mdi-cog',
          link: '/settings',
          requireAuth: true,
        },
      ]
    })

    const otherMenuListsFiltered = computed(() => {
      if (isLogin) {
        return otherMenuLists.value
      } else {
        return otherMenuLists.value.filter(
          (otherMenu) => otherMenu.requireAuth !== true
        )
      }
    })

    const logout = async () => {
      try {
        await $axios.post('/logout')
      } catch (error) {
        if (!$axios.isAxiosError(error) || error.response!.status !== 401)
          return
        console.log(error)
      }
      store.commit('updateAuthUser', {
        username: '',
        nickname: '',
      })
    }

    return {
      drawer,
      getAuthUser,
      isLogin,
      logoPath,
      otherMenuLists,
      otherMenuListsFiltered,
      siteMenuLists,
      tools,
      logout,
    }
  },
  // watch: {
  //   $route(to) {
  //     this.createPageTitle(to.meta)
  //   },
  // },
  // mounted() {
  //   const to = this.$route
  //   this.createPageTitle(to.meta)
  // },
  // methods: {
  //   /* ページが遷移したときにメタタグを書き換える */
  //   createPageTitle(meta: { title: string; desc: string }) {
  //     // titleを取得
  //     const currentTitle = document.querySelectorAll(
  //       "meta[name='twitter:title'], meta[property='og:title']"
  //     )
  //     // titleが存在する場合は書き換え、存在しない場合はデフォルトに設定
  //     let rewriteTitle = 'Pokemonote'
  //     if (meta.title) {
  //       rewriteTitle = meta.title + ' | Pokemonote'
  //     }
  //     for (let i = 0, len = currentTitle.length; i < len; i++) {
  //       currentTitle[i].setAttribute('content', rewriteTitle)
  //     }
  //     document.title = rewriteTitle
  //     // descriptionを取得
  //     const currentDesc = document.querySelectorAll(
  //       "meta[name='description'], meta[name='twitter:description'], meta[property='og:description']"
  //     )
  //     // descriptionが存在する場合は書き換え、存在しない場合はデフォルトに設定
  //     if (meta.desc) {
  //       for (let i = 0, len = currentDesc.length; i < len; i++) {
  //         currentDesc[i].setAttribute('content', meta.desc)
  //       }
  //     } else {
  //       for (let i = 0, len = currentDesc.length; i < len; i++) {
  //         currentDesc[i].setAttribute(
  //           'content',
  //           'ポケモンのステータスを計算・管理するためのWebアプリ『Pokemonote』へようこそ！ 素早さ計算機や剣盾に対応した種族値ランキングといったツールも公開しています。「シンプルで高機能」なツールにこだわって制作していますので、是非お試しください。'
  //         )
  //       }
  //     }
  //   },
  // },
})
</script>

<style lang="scss">
// Vuetifyのテーマカラー
$primary: #1976d2;
$danger: #d32f2f;
// ハートの色
$heart1: #bbdefb;
$heart2: #90caf9;
// スマホのサイズ
$breakpoint-iPhone8Plus: 414px;
$breakpoint-Android: 360px;
$breakpoint-iPhoneSE: 320px;
// ブレークポイント毎にmixinを使うと楽
@mixin iPhone8Plus {
  @media screen and (max-width: $breakpoint-iPhone8Plus) {
    @content;
  }
}
@mixin Android {
  @media screen and (max-width: $breakpoint-Android) {
    @content;
  }
}
@mixin iPhoneSE {
  @media screen and (max-width: $breakpoint-iPhoneSE) {
    @content;
  }
}

.text-primary {
  color: $primary;
}
.text-danger {
  color: $danger;
}

// iPhoneSEでもタイトルを1行で表示するために文字サイズを調整した
#title {
  @include iPhoneSE() {
    font-size: 1.13rem !important;
  }
}

// iOSのSafariではdisabledに透過がかかって非常に読みにくいので、opacityを明示的に指定している
input[disabled],
textarea[disabled],
select[disabled='disabled'] {
  opacity: 1;
}

// ダブルタップによる拡大・縮小を無効化(スマホのUIを向上させる目的)
button {
  touch-action: manipulation;
}

// リボン風の見出しを作る
h2 {
  position: relative;
  background: $primary;
  box-shadow: 0px 0px 0px 5px $primary;
  border: dashed 2px #dee2e6;
  padding: 0.4em 0.5em;
  color: white;
}
h2:after {
  position: absolute;
  content: '';
  left: -7px;
  top: -7px;
  border-width: 0 0 15px 15px;
  border-style: solid;
  border-color: #fff #fff darken($primary, 10%);
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.15);
}

// 各要素の背景色や枠線など、基本となるスタイルを定義

// テーブルの奇数行に背景色をつける
.v-data-table td {
  background: #ffffff;
}
.v-data-table tr:nth-child(odd) td {
  background: #f0f8ff;
}
.v-data-table tr:hover td {
  background-color: #eee;
}
/* デフォルトのボタンだと横幅が大きすぎるのを調整する */
.btn-min-xs {
  min-width: 2.5em !important;
}
.btn-min-sm {
  min-width: 3em !important;
}
.statsTable {
  margin-top: 12px;
  /* ステータスの入力時にハイライトをつけて見やすくする */
  .row:hover:not(:nth-last-child(-n + 1)) {
    background-color: #eee;
  }
  // 文字の色を変えることで、性格補正を分かりやすく！
  .text-primary input {
    color: $primary !important;
  }
  .text-danger input {
    color: $danger !important;
  }
  // 小さなスマートフォンでも表示が崩れないようにするための処理
  .col {
    @include iPhone8Plus() {
      padding-right: 8px;
      padding-left: 8px;
    }
  }
  .v-text-field__slot {
    @include Android {
      font-size: 98%;
    }
    @include iPhoneSE {
      font-size: 90%;
    }
  }
  label {
    @include Android {
      font-size: 98%;
    }
    @include iPhoneSE {
      font-size: 90%;
    }
  }
  .v-btn__content {
    @include Android {
      font-size: 0.98em;
    }
    @include iPhoneSE() {
      font-size: 0.9em;
    }
  }
  .btn-min-xs {
    @include Android {
      min-width: 2.46em !important;
    }
    @include iPhoneSE {
      min-width: 2.35em !important;
    }
  }
  .btn-min-sm {
    @include Android {
      min-width: 2.95em !important;
    }
    @include iPhoneSE {
      min-width: 2.8em !important;
    }
  }
  .hiddenPower {
    @include iPhoneSE {
      font-size: 82%;
    }
  }
}

// アラート
#notice {
  position: absolute !important;
  z-index: 100 !important;
}
</style>
