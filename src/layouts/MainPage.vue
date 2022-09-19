<template>
  <input type="checkbox" id="checkbox" v-model="checked" />
  <div class="mainpage">
    <div v-if="checked == true">
      <div class="off__page"></div>
    </div>
    <div class="car-card-cont" v-else>
      <div></div>
    </div>

    <div class="main__tel">
      <h1>Телефон</h1>
      <div>
        <input
          type="text"
          name="tel1"
          id="tel1"
          v-model="mainpage.tel1"
          placeholder="777 84 56"
        />
        <input
          type="text"
          name="tel2"
          id="tel2"
          v-model="mainpage.tel2"
          placeholder="777 84 56"
        />
      </div>
    </div>
    <div class="main__seo">
      <h1>SEO текст</h1>
      <div>
        <input
          type="text"
          name="seo"
          id="seo"
          v-model="mainpage.seo"
          placeholder="текст"
        />
      </div>
    </div>
    <div class="main__seo-block">
      <h1>SEO блок</h1>
      <div>
        <input
          type="text"
          name="url"
          id="url"
          v-model="mainpage.url"
          placeholder="url"
        />
        <input
          type="text"
          name="title"
          id="title"
          v-model="mainpage.title"
          placeholder="title"
        />
        <input
          type="text"
          name="keywords"
          id="keywords"
          v-model="mainpage.keywords"
          placeholder="word"
        />
        <input
          type="text"
          name="description"
          id="description"
          v-model="mainpage.description"
          placeholder="description"
        />
      </div>
    </div>
    <h1 @click="Add">Сохранить</h1>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
export default {
  name: "MainPage",
  props: {},
  data() {
    return {
      mainpage: {},
      checked: false,
    };
  },
  methods: {
    async Add() {
      const pagedata = doc(db, "page", "main");
      await setDoc(pagedata, {
        tel1: this.mainpage.tel1,
        tel2: this.mainpage.tel2,
        seo: this.mainpage.seo,
        url: this.mainpage.url,
        title: this.mainpage.title,
        keywords: this.mainpage.keywords,
        description: this.mainpage.description,
      });
    },
    getData() {
      onSnapshot(doc(db, "page", "main"), (doc) => {
        this.mainpage = doc.data();
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>


<style scoped lang="scss">
.mainpage {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  .off__page {
    position: absolute;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
  }
  .main__tel {
    display: flex;
    flex-direction: row;
    h1 {
      margin: 0;
    }
    div {
      display: flex;
      flex-direction: column;
    }
    input {
      margin: 5%;
    }
  }
}
</style>
