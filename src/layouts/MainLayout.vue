<template>


  <div class="wrapper">
    
 <NavBar />
<SideBar />

    <div class="content-wrapper">
      
      <router-view />

    </div>

  </div>
</template>

<script>

import NavBar from "./inc/NavBar.vue";
import SideBar from "./inc/SideBar.vue";

export default {
  components: {
    NavBar,
    SideBar,


  },
};
</script>
