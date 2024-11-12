<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import getUniqueRandomCharacters from '../utilities/GetRandomCharacters'

interface Character {
  id: number
  name: string
  image: string
  episodes: string[]
}
const router = useRouter()
const characters = ref<Character[]>([])
const shuffledCharacters = ref<Character[]>([])
const correctMatches = ref<{ [key: number]: boolean }>({})
const episodes = ref<{ [key: number]: string[] }>({})
const showEpisodes = ref<{ [key: number]: boolean }>({})
const draggedCharacter = ref<Character | null>(null)

const isGameComplete = computed(
  () =>
    Object.values(correctMatches.value).length === 4 &&
    Object.values(correctMatches.value).every((match) => match),
)

// Функция для запроса API и перемешивания персонажей
const fetchCharacters = async () => {
  const ids = getUniqueRandomCharacters(4, 1, 826)
  const response = await fetch(`https://rickandmortyapi.com/api/character/${ids}`)
  const data = await response.json()
  console.log(data)
  const fourCharacters = data.slice(0, 4)
  characters.value = fourCharacters.map((char: any) => ({
    id: char.id,
    name: char.name,
    image: char.image,
    episodes: char.episode.slice(0, 10),
  }))
  shuffledCharacters.value = [...characters.value].sort(() => Math.random() - 0.5)
  episodes.value = characters.value.reduce(
    (acc, character) => {
      acc[character.id] = character.episodes
        .map((episodeUrl: string) => episodeUrl?.split('/').pop())
        .filter((episode) => episode !== undefined) as string[]
      return acc
    },
    {} as { [key: number]: string[] },
  )
}

// Начало перетаскивания
const startDrag = (character: Character) => {
  draggedCharacter.value = character
}

// Обработчик для разрешения дропа
const allowDrop = (event: DragEvent) => {
  event.preventDefault()
}

// Обработчик дропа
const handleDrop = (targetCharacter: Character) => {
  if (draggedCharacter.value) {
    if (draggedCharacter.value.id === targetCharacter.id) {
      correctMatches.value[targetCharacter.id] = true
    } else {
      correctMatches.value[targetCharacter.id] = false
    }
    draggedCharacter.value = null
  }
}

// Класс для дропзоны
const dropZoneClass = (characterId: number) => {
  if (correctMatches.value[characterId] === true) return 'dropzone-correct'
  if (correctMatches.value[characterId] === false) return 'dropzone-incorrect'
  return ''
}

// Показать или скрыть эпизоды
const toggleEpisodes = (characterId: number) => {
  showEpisodes.value[characterId] = !showEpisodes.value[characterId]
}

// Завершить игру
const finishGame = () => {
  if (isGameComplete.value) {
    router.push('/win')
  }
}

onMounted(fetchCharacters)
</script>
<template>
  <div class="game-container">
    <h1>Игра "Сопоставь персонажей"</h1>

    <!-- Имена для перетаскивания -->
    <div class="names-container">
      <div
        v-for="character in shuffledCharacters"
        :key="character.id"
        class="name"
        draggable="true"
        @dragstart="startDrag(character)"
      >
        {{ character.name }}
      </div>
    </div>

    <!-- Основной контейнер для изображений и дропзон -->
    <div class="characters-dropzones-container">
      <!-- Колонка с картинками персонажей -->
      <div class="characters-row">
        <div v-for="character in characters" :key="character.id" class="character">
          <img :src="character.image" :alt="character.name" />

          <!-- Эпизоды, если имя и изображение совпадают -->
          <div v-if="correctMatches[character.id]" class="episodes">
            <div
              v-for="(episode, idx) in episodes[character.id].slice(
                0,
                showEpisodes[character.id] ? 10 : 2,
              )"
              :key="idx"
            >
              Episode {{ episode }}
            </div>
            <button
              v-if="episodes[character.id] && episodes[character.id].length > 2"
              @click="toggleEpisodes(character.id)"
            >
              {{ showEpisodes[character.id] ? 'Скрыть' : 'Показать еще' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Колонка с дропзонами -->
      <div class="dropzones-row">
        <div
          v-for="character in characters"
          :key="character.id"
          class="dropzone"
          :class="dropZoneClass(character.id)"
          @dragover.prevent="allowDrop"
          @drop="handleDrop(character)"
        >
          {{ correctMatches[character.id] === true ? `${character.name}` : 'Drop here' }}
        </div>
      </div>
    </div>

    <!-- Кнопка "Готово" -->
    <button :disabled="!isGameComplete" @click="finishGame" class="button">Готово</button>
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.names-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.name {
  padding: 10px;
  background: #f0f0f0;
  cursor: pointer;
}

.characters-dropzones-container {
  min-width: 100%;
  max-width: 70vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 40px;
}

.characters-row,
.dropzones-row {
  display: flex;
  gap: 20px;
}

.character {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.character img {
  width: 100%;
  height: auto;
  border: 1px solid #ccc;
  padding: 10px;
}

.dropzone {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #aaa;
  padding: 10px;
}

.dropzone-correct {
  border-color: green;
}

.dropzone-incorrect {
  border-color: red;
}

.episodes {
  margin-top: 5px;
  font-size: 0.9em;
}
</style>
