<template>
  <content-header title="About" />
  <content>
    <div class="inp">
      <input type="text" id="tel1" v-model="main.tel1" />
      <input type="text" id="tel2" v-model="main.tel2" />
      <input type="text" id="seo" v-model="main.seo" />
      <input type="text" id="url" v-model="main.url" />
      <input type="text" id="title" v-model="main.title" />
      <input type="text" id="description" v-model="main.description" />
      <input type="text" id="keywords" v-model="main.keywords" />
      <h1 @click="add">Add</h1>
    </div>
  </content>
</template>
<script>
import {
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteField,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
export default {
  data() {
    return {
      main: {},
    };
  },
  methods: {
    checkonline() {
      onSnapshot(doc(db, "page", "main"), (doc) => {
        this.main = doc.data();
      });
    },
    async add() {
      await setDoc(doc(db, "page", "main"), {
        tel1: this.main.tel1,
        tel2: this.main.tel2,
        seo: this.main.seo,
        url: this.main.url,
        title: this.main.title,
        description: this.main.description,
        keywords: this.main.keywords,
      });
    },
  },
  mounted() {

    this.checkonline();

  },
};
</script>

<style scoped>
.inp {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>