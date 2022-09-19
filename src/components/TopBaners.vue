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
      <div v-show="topBanersisUpload" class="overlay dark" bis_skin_checked="1">
        <i class="fas fa-3x fa-sync-alt fa-spin"></i>
        <div class="text-bold pt-2" bis_skin_checked="1">Сохранение...</div>
        <div class="text-bold pt-2" bis_skin_checked="1">
          Не обновляйте браузер, не закрывайте страницу.
        </div>
      </div>
      <h1 class="page-title">На главной верх</h1>
      <div class="img-cont">
        <div class="new-img" v-for="(value, name) in imgs" :key="name">
          <img :src="value" alt="error" />
          <h1 @click="deleteImage(name, value)">✖️</h1>
          <div class="form-group" bis_skin_checked="1">
            <label>{{ bannersText[name] }}</label>
            <input
              type="text"
              id="name"
              v-model="bannersText[name]"
              class="form-control"
              placeholder="Текст баннера"
            />
          </div>
        </div>
        <div class="new-img add-img">
          <input
            class="hidden-input"
            type="file"
            ref="file"
            accept="image/*"
            id="addimg"
            v-on:change="handleFileUpload()"
          />
          <label for="addimg"
            ><a class="btn btn-app">
              <i class="fas fa-edit"></i> Добавить фото
            </a></label
          >
        </div>
      </div>
      <div class="submit">
        <div class="form-group" bis_skin_checked="1">
          <label>Скорость вращения (секунды) </label>
          <select class="form-control" v-model="rolSpeed">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </div>
        <button
          type="button"
          @click="add"
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
      file: "",
      imgs: {},
      delimgs: [],
      loadimgs: {},
      urlimgs: {},
      bannersText: {},
      topBanersisUpload: false,
      rolSpeed: Number,
    };
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      this.loadimgs[this.file.name] = this.file;
      let reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          this.imgs[this.file.name] = reader.result;
        }.bind(this),
        false
      );
      reader.readAsDataURL(this.file);
    },
    deleteImage(name) {
      const imgs = { ...this.imgs };
      const urlimgs = { ...this.urlimgs };
      const loadimgs = { ...this.loadimgs };
      const bannersText = { ...this.bannersText };

      delete imgs[name];
      delete urlimgs[name];
      delete loadimgs[name];
      delete bannersText[name];

      this.delimgs.push(name);

      this.bannersText = bannersText;
      this.loadimgs = loadimgs;
      this.urlimgs = urlimgs;
      this.imgs = imgs;
    },

    checkonline() {
      onSnapshot(doc(db, "image-urls", "banners-top"), (doc) => {
        try {
          this.imgs = doc.data().urls;
          this.urlimgs = doc.data().urls;
          this.bannersText = doc.data().bannersText;
          this.rolSpeed = doc.data().rolSpeed;
        } catch {
          console.log("error take data from store");
        }
      });
    },
    async add() {
      this.topBanersisUpload = true;
      for (var key in this.loadimgs) {
        const storageRef = ref(storage, "images/banners/topbaners/" + key);
        const metadata = {
          contentType: "image/jpeg",
        };

        await uploadBytesResumable(storageRef, this.loadimgs[key], metadata);

        await getDownloadURL(ref(storage, "images/banners/topbaners/" + key))
          .then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = (event) => {
              const blob = xhr.response;
            };
            xhr.open("GET", url);

            this.urlimgs[key] = url;
          })
          .catch((error) => {
            console.log("error take url");
          });
      }

      try {
        await setDoc(doc(db, "image-urls", "banners-top"), {
          urls: this.urlimgs,
          bannersText: this.bannersText,
          rolSpeed: this.rolSpeed,
        });
      } catch {
        console.log("error to upload data to store");
      }

      this.delimgs.forEach(function (item) {
        const deleteRef = ref(storage, "images/banners/topbaners/" + item);
        deleteObject(deleteRef)
          .then(() => {})
          .catch((error) => {
            console.log(item + " already delete");
          });
      });
      this.delimgs = [];
      this.topBanersisUpload = false;
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
