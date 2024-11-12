export default function getUniqueRandomCharacters(count: number, min: number, max: number): string {
  const numbers = new Set<number>()

  while (numbers.size < count) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
    numbers.add(randomNumber)
  }

  return Array.from(numbers).join(',')
}
