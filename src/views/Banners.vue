<template>
  <content-header title="Баннера" />
  <content>
    <TopBaners />
    <MainBaner />
    <MainNews />
  </content>
</template>
<script>
import TopBaners from "@/components/TopBaners.vue";
import MainBaner from "@/components/MainBaner.vue";
import MainNews from "@/components/MainNews.vue";
export default {
  components: {
    TopBaners,
    MainBaner,
    MainNews,
  },
};
</script>