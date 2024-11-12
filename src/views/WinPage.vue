<template>
  <div class="wrapper">
    <h1>Игра пройдена!</h1>
    <button @click="restartGame" class="button">Начать заново</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const restartGame = () => {
  router.push('/')
}
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
}
</style>
