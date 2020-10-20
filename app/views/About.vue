<template>
  <div class="about">
    <h1>This is an about page {{ book }}</h1>
  </div>
</template>

<script>
import { Book } from '../store/book'
export default {
  dataStore: {
    name: 'book',
    store: Book
  },
  computed: {
    book() {
      console.log(`this.$store.state`, this.$store.state)
      console.log(`this.$store.state.book`, this.$store.state.book)
      return (
        this.$store.state.book &&
        this.$store.state.book.items[this.$route.params.id || 1]
      )
    }
  },
  preFetch({ store, route }) {
    return store.dispatch('book/fetchItem', route.params.id || 1)
  }
}
</script>

<style>
.about {
  background: red;
}
</style>
