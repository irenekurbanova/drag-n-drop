import { ref } from 'vue'

export default function useFetchData<T>(url: string) {
  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const loading = ref<boolean>(false)

  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`)
      }

      data.value = await response.json()
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  fetchData()

  return { data, error, loading, refetch: fetchData }
}
