<template>
  <div
    style="margin-top: 5%"
    class="tab-pane fade active show"
    id="custom-tabs-five-overlay-dark"
    role="tabpanel"
    aria-labelledby="custom-tabs-five-overlay-dark-tab"
    bis_skin_checked="1"
  >
    <div class="overlay-wrapper" bis_skin_checked="1">
      <div v-show="newsUpload" class="overlay dark" bis_skin_checked="1">
        <i class="fas fa-3x fa-sync-alt fa-spin"></i>
        <div class="text-bold pt-2" bis_skin_checked="1">Сохранение...</div>
        <div class="text-bold pt-2" bis_skin_checked="1">
          Не обновляйте браузер, не закрывайте страницу.
        </div>
      </div>
      <h1 class="page-title">На главной Новости,Акции</h1>
      <div class="img-cont">
        <div class="new-img" v-for="(value, name) in imgsnews" :key="name">
          <img :src="value" alt="error" />
          <h1 @click="newsDeleteImage(name, value)">✖️</h1>
          <div class="form-group" bis_skin_checked="1">
            <label>{{ newsText[name] }}</label>
            <input
              type="text"
              id="name"
              v-model="newsText[name]"
              class="form-control"
              placeholder="Текст баннера"
            />
          </div>
        </div>
        <div class="new-img add-img">
          <input
            class="hidden-input"
            type="file"
            ref="newsfile"
            accept="image/*"
            id="newsaddimg"
            v-on:change="handlenewsfileUpload()"
          />
          <label for="newsaddimg"
            ><a class="btn btn-app">
              <i class="fas fa-edit"></i> Добавить фото
            </a></label
          >
        </div>
      </div>
      <div class="submit">
        <div class="form-group" bis_skin_checked="1">
          <label>Скорость вращения (секунды) </label>
          <select class="form-control" v-model="newsrolSpeed">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </div>
        <button
          type="button"
          @click="addNews"
          class="btn btn-block bg-gradient-primary btn-lg"
        >
          Сохранить
        </button>
      </div>
    </div>
  </div>
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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";
import { storage, db } from "@/firebase";
export default {
  data() {
    return {
      newsfile: "",
      imgsnews: {},
      delimgsnews: [],
      loadimgsnews: {},
      urlimgsnews: {},
      newsText: {},
      newsUpload: false,
      newsrolSpeed: Number,
    };
  },
  methods: {
    handlenewsfileUpload() {
      this.newsfile = this.$refs.newsfile.files[0];
      this.loadimgsnews[this.newsfile.name] = this.newsfile;
      let reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          this.imgsnews[this.newsfile.name] = reader.result;
        }.bind(this),
        false
      );
      reader.readAsDataURL(this.newsfile);
    },
    newsDeleteImage(name) {
      const imgsnews = { ...this.imgsnews };
      const urlimgsnews = { ...this.urlimgsnews };
      const loadimgsnews = { ...this.loadimgsnews };
      const newsText = { ...this.newsText };

      delete imgsnews[name];
      delete urlimgsnews[name];
      delete loadimgsnews[name];
      delete newsText[name];

      this.delimgsnews.push(name);

      this.newsText = newsText;
      this.loadimgsnews = loadimgsnews;
      this.urlimgsnews = urlimgsnews;
      this.imgsnews = imgsnews;
    },

    checkonline() {
      onSnapshot(doc(db, "image-urls", "news-banners"), (doc) => {
        try {
          this.imgsnews = doc.data().urls;
          this.urlimgsnews = doc.data().urls;
          this.newsText = doc.data().newsText;
          this.newsrolSpeed = doc.data().newsrolSpeed;
        } catch {
          console.log("error take data from store");
        }
      });
    },
    async addNews() {
      this.newsUpload = true;
      for (var key in this.loadimgsnews) {
        const storageRef = ref(storage, "images/banners/newsbaners/" + key);
        const metadata = {
          contentType: "image/jpeg",
        };

        await uploadBytesResumable(storageRef, this.loadimgsnews[key], metadata);

        await getDownloadURL(ref(storage, "images/banners/newsbaners/" + key))
          .then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = (event) => {
              const blob = xhr.response;
            };
            xhr.open("GET", url);

            this.urlimgsnews[key] = url;
          })
          .catch((error) => {
            console.log("error take url");
          });
      }

      try {
        await setDoc(doc(db, "image-urls", "news-banners"), {
          urls: this.urlimgsnews,
          newsText: this.newsText,
          newsrolSpeed: this.newsrolSpeed,
        });
      } catch {
        console.log("error to upload data to store");
      }

      this.delimgsnews.forEach(function (item) {
        const deleteRef = ref(storage, "images/banners/newsbaners/" + item);
        deleteObject(deleteRef)
          .then(() => {})
          .catch((error) => {
            console.log(item + " already delete");
          });
      });
      this.delimgsnews = [];
      this.newsUpload = false;
    },
  },
  mounted() {
    this.checkonline();
  },
};
</script>
<style scoped lang="scss">
.submit {
  display: flex;
  flex-direction: column;
  width: 25%;
  margin: auto;
}
.img-cont {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}
.hidden-input {
  display: none;
}
.add-img {
  align-self: center;
}
.new-img {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 25px;
  .form-group {
    label {
      word-wrap: break-word;
      width: 200px;
    }
  }
  img {
    width: 200px;
    height: 200px;
  }
  h1 {
    position: absolute;
    top: 0;
    right: 0;
  }
  label {
    a {
      margin: auto;
    }
  }
}
</style>
