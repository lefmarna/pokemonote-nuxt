<template>
  <div>
    <div class="jumbotron">
      <v-img
        alt="Pokemonote ポケモンをもっと楽しく！"
        class="shrink"
        :src="require('@/assets/pokemonote.svg')"
        transition="scale-transition"
        max-height="492"
        min-height="164"
      />
    </div>
    <v-container>
      <v-row class="d-flex my-sm-2">
        <v-col cols="12" md="6" class="d-flex order-md-2">
          <v-card class="flex-fill text-center m-auto">
            <h2 class="headline font-weight-bold ma-2 mb-3">人気のポケモン</h2>
            <v-list>
              <v-list-item v-for="(item, index) in $store.getters.ranking" :key="item.name">
                <v-list-item-content>
                  <v-list-item-title align="left">{{ index + 1 }}位 {{ item.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" class="d-flex order-md-1">
          <v-card style="width: 100%">
            <h2 class="headline font-weight-bold ma-2 mb-3 text-center">更新情報</h2>
            <v-sheet class="body-1 overflow-y-auto" max-height="280">
              <div class="px-2">
                <div>
                  <h3>2023-09-14</h3>
                  <p>
                    種族値ランキングの「SVに登場しないポケモン」をチェックしていない状態でのフィルタリングから「碧の仮面」で解禁されたポケモンを除外
                  </p>
                </div>
                <div>
                  <h3>2023-09-13</h3>
                  <p>ポケモンSVのDLC「ゼロの秘宝 - 碧の仮面」に登場するポケモンに対応</p>
                </div>
                <div>
                  <h3>2023-05-30</h3>
                  <p>種族値ランキングでホームの解禁ポケモンに対応</p>
                </div>
                <div>
                  <h3>2023-02-28</h3>
                  <p>ウネルミナモ・テツノイサハ対応</p>
                </div>
                <div>
                  <h3>2023-02-13</h3>
                  <p>「パスワードをお忘れの方はこちら」機能の実装</p>
                </div>
              </div>
              <div class="px-2">
                <div>
                  <h3>2023-02-07</h3>
                  <p>メールアドレスの更新機能の公開</p>
                </div>
              </div>
              <div class="px-2">
                <div>
                  <h3>2023-02-04</h3>
                  <p>メールアドレスの更新機能の実装（正常に動作しなかったため一旦公開停止）</p>
                </div>
              </div>
              <div class="px-2">
                <div>
                  <h3>2023-01-11</h3>
                  <p>アカウント情報の変更機能の実装</p>
                </div>
              </div>
              <div class="px-2">
                <div>
                  <h3>2022-12-31</h3>
                  <p>パスワードの更新機能の実装</p>
                </div>
              </div>
              <div class="px-2">
                <div>
                  <h3>2022-12-23</h3>
                  <p>ステータス計算機で保存されたはずのポケモンの説明が表示されない不具合の修正</p>
                </div>
              </div>
              <div class="px-2">
                <div>
                  <h3>2022-12-03</h3>
                  <p>ポケモンSV対応完了</p>
                </div>
              </div>
              <div class="px-2">
                <div>
                  <h3>2022-11-26</h3>
                  <p>ポケモンSV対応準備（随時追加予定）</p>
                </div>
              </div>
              <div class="px-2">
                <div>
                  <h3>2021-11-18</h3>
                  <p>『Pokemonote』α版を公開しました。</p>
                </div>
              </div>
              <div class="px-2">
                <div>
                  <h3>2021-04-30</h3>
                  <p>『Pokemonote』プロトタイプを公開しました。</p>
                </div>
              </div>
            </v-sheet>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <h2 class="headline font-weight-bold ma-2 mb-3 text-center">Pokemonoteについて</h2>
            <div class="px-2 pt-2 pb-1">
              <p>
                当サイトは、個人の運営するファンサイトであり、株式会社ポケモンや任天堂、その他各企業様とは一切関係ありません。
              </p>
              <p>ポケットモンスター・ポケモン・Pokémonは任天堂・クリーチャーズ・ゲームフリークの登録商標です。</p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $axios } = useContext()
    const store = useStore()

    ;(async () => {
      try {
        const response = await $axios.get('/top')
        store.commit('updateRanking', response.data.data)
      } catch (error) {
        console.log(error)
      }
    })()
  },
})
</script>

<style lang="scss" scoped>
h3 {
  padding: 3px 0px;
  margin-bottom: 3px;
  border-bottom: double 5px #90caf9;
}
</style>
