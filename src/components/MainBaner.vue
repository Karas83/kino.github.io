<template>
  <div
    style="margin-top: 5%"
    class="tab-pane fade active show mainbaner"
    id="custom-tabs-five-overlay-dark"
    role="tabpanel"
    aria-labelledby="custom-tabs-five-overlay-dark-tab"
    bis_skin_checked="1"
  >
    <div class="overlay-wrapper" bis_skin_checked="1">
      <div
        v-show="mainBanersisUpload"
        class="overlay dark"
        bis_skin_checked="1"
      >
        <i class="fas fa-3x fa-sync-alt fa-spin"></i>
        <div class="text-bold pt-2" bis_skin_checked="1">Сохранение...</div>
        <div class="text-bold pt-2" bis_skin_checked="1">
          Не обновляйте браузер, не закрывайте страницу.
        </div>
      </div>
      <h1 class="page-title">Сквозной банер на заднем фоне</h1>
      <div class="mainbanner-contfortupe">
        <div class="submit">
          <div class="custom-control custom-radio" bis_skin_checked="1">
            <input
              value="1"
              v-model="fontType"
              type="radio"
              id="imgfont"
              name="customRadio"
              class="custom-control-input"
            />
            <label for="imgfont" class="custom-control-label"
              >Фото на фоне</label
            >
          </div>

          <div class="custom-control custom-radio" bis_skin_checked="1">
            <input
              value="2"
              v-model="fontType"
              type="radio"
              id="colorfont"
              name="customRadio"
              class="custom-control-input custom-control-input-danger"
            />
            <label for="colorfont" class="custom-control-label"
              >Просто фон</label
            >
          </div>

          <button
            @click="setFontType"
            type="button"
            class="btn btn-block bg-gradient-primary btn-lg"
          >
            Сохранить тип фона
          </button>
        </div>
        <div v-if="fontType == 1" class="img-cont mainbaner-cont">
          <div
            class="new-img"
            v-for="(value, name) in mainbanerprev"
            :key="name"
          >
            <img :src="value" alt="error" />
          </div>
          <div class="new-img add-img">
            <input
              class="hidden-input"
              type="file"
              ref="filemain"
              accept="image/*"
              id="addimgmain"
              v-on:change="mainBanerAdd()"
            />
            <label for="addimgmain">
              <a class="btn btn-app">
                <i class="fas fa-edit"></i> Добавить фото
              </a>
            </label>
            <label @click="deleteImageMainBaner">
              <a class="btn btn-app">
                <i class="icon fas fa-ban"></i> Удалить фото</a
              >
            </label>
          </div>
        </div>
        <div v-if="fontType == 2" class="img-cont mainbaner-cont">
          <ColorPicker
            :color="color"
            @color-change="updateColor"
            :visible-formats="['hex']"
            default-format="hex"
          >
          </ColorPicker>
          <div v-if="color == ''"></div>
          <div
            v-else
            v-bind:style="{
              width: '200px',
              height: '200px',
              backgroundColor: color,
            }"
          ></div>
          <label @click="addFontColor">
            <a class="btn btn-app">
              <i class="fas fa-edit"></i> Сохранить выбраный фон
            </a>
          </label>
          <label @click="deleteFontColor">
            <a class="btn btn-app">
              <i class="icon fas fa-ban"></i> Удалить фон</a
            >
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ColorPicker } from "vue-accessible-color-picker";
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
  components: {
    ColorPicker,
  },
  data() {
    return {
      file: "",
      mainBanersisUpload: false,
      mainbaner: {},
      mainbanerprev: {},
      mainbanerurl: {},
      fontType: 1,
      color: "#0ccf0ccc",
    };
  },
  methods: {
    updateColor(eventData) {
      this.color = eventData.cssColor;
    },
    async mainBanerAdd() {
      this.mainBanersisUpload = true;
      this.file = this.$refs.filemain.files[0];
      this.mainbaner.mainbaner = this.file;
      let reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          this.mainbanerprev.mainbaner = reader.result;
        }.bind(this),
        false
      );
      reader.readAsDataURL(this.file);
      const storageRef = ref(storage, "images/banners/mainbaner/mainbaner.png");
      const metadata = {
        contentType: "image/jpeg",
      };

      await uploadBytesResumable(
        storageRef,
        this.mainbaner.mainbaner,
        metadata
      );

      await getDownloadURL(
        ref(storage, "images/banners/mainbaner/mainbaner.png")
      )
        .then((url) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = (event) => {
            const blob = xhr.response;
          };
          xhr.open("GET", url);

          this.mainbanerurl.mainbaner = url;
        })
        .catch((error) => {
          console.log("error take url");
        });
      try {
        await setDoc(doc(db, "image-urls", "banner-main"), {
          urls: this.mainbanerurl,
          fontType: this.fontType,
          color: this.color,
        });
      } catch {
        console.log("error to upload data to store");
      }
      this.mainBanersisUpload = false;
    },

    async deleteImageMainBaner() {
      this.mainBanersisUpload = true;
      this.mainbaner = {};
      this.mainbanerprev = {};
      this.mainbanerurl = {};
      const deleteRef = ref(storage, "images/banners/mainbaner/mainbaner.png");
      deleteObject(deleteRef)
        .then(() => {})
        .catch((error) => {
          console.log("Main baner already delete");
        });
      try {
        await setDoc(doc(db, "image-urls", "banner-main"), {
          urls: this.mainbanerurl,
          fontType: this.fontType,
          color: this.color,
        });
      } catch {
        console.log("error to upload data to store");
      }
      this.mainBanersisUpload = false;
    },

    async setFontType() {
      this.mainBanersisUpload = true;
      try {
        await setDoc(doc(db, "image-urls", "banner-main"), {
          urls: this.mainbanerurl,
          color: this.color,
          fontType: this.fontType,
        });
      } catch {
        console.log("error to upload data to store");
      }
      this.mainBanersisUpload = false;
    },

    async addFontColor() {
      this.mainBanersisUpload = true;
      try {
        await setDoc(doc(db, "image-urls", "banner-main"), {
          urls: this.mainbanerurl,
          color: this.color,
          fontType: this.fontType,
        });
      } catch {
        console.log("error to upload data to store");
      }
      this.mainBanersisUpload = false;
    },

    async deleteFontColor() {
      this.mainBanersisUpload = true;
      this.color = "";
      try {
        await setDoc(doc(db, "image-urls", "banner-main"), {
          urls: this.mainbanerurl,
          fontType: this.fontType,
          color: this.color,
        });
      } catch {
        console.log("error to upload data to store");
      }
      this.mainBanersisUpload = false;
    },

    checkonline() {
      onSnapshot(doc(db, "image-urls", "banner-main"), (doc) => {
        try {
          this.mainbanerprev = doc.data().urls;
          this.mainbanerurl = doc.data().urls;
          this.color = doc.data().color;
          this.fontType = doc.data().fontType;
        } catch {
          console.log("error take data from store");
        }
      });
    },
  },
  mounted() {
    this.checkonline();
  },
};
</script>
<style  lang="scss">
.page-title {
  text-align: center;
}
.mainbaner {
  .mainbanner-contfortupe {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
  .vacp-copy-button {
    display: none;
  }
  .mainbaner-cont {
    justify-content: center;
  }

  .submit {
    display: flex;
    flex-direction: column;
    width: 25%;
  }
  .img-cont {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 75%;
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
}
</style>
