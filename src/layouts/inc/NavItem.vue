<template>
  <li class="nav-item">
    <router-link class="nav-link" :to="link" :class="{ active: isActive() }">
      
      <p><slot /></p>
    </router-link>
  </li>
</template>
<script>
export default {
  props: {
    link: {
      type: [String, Object],
      default: null,
    },
  },
  methods: {
    isActive(){
        if (typeof this.link === "object"){
            return this.$route.name === this.link.name;
        }else{
            return this.$route.path === this.link;
        }
    }
  }
};
</script>