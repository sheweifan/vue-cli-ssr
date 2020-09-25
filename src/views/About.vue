<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
export default {
  created() {
    console.log(`process.env.VUE_ENV`, process.env.VUE_ENV)
    console.log(`process.env.TARGET_NODE`, process.env)
  }
}
</script>

<style>
.about {
  background: red;
}
</style>
