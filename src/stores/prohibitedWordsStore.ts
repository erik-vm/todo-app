import { defineStore } from 'pinia'
import { ref } from 'vue'
import Cookies from 'js-cookie'

const DEFAULT_PROHIBITED_WORDS = [
  'hernesupp', 'duck around', 'kuulilennuteetunneliluuk'
]

export const useProhibitedStore = defineStore('prohibited', () => {
  const prohibitedWords = ref<string[]>([])

  const loadProhibitedWords = () => {
    // Try localStorage first
    const storedWords = localStorage.getItem('prohibitedWords')
    if (storedWords) {
      prohibitedWords.value = JSON.parse(storedWords)
      return
    }

    // Fallback to cookies
    const cookieWords = Cookies.get('prohibitedWords')
    if (cookieWords) {
      prohibitedWords.value = JSON.parse(cookieWords)
      return
    }

    // Use default words
    prohibitedWords.value = [...DEFAULT_PROHIBITED_WORDS]
  }

  const saveProhibitedWords = () => {
    const wordsJson = JSON.stringify(prohibitedWords.value)
    localStorage.setItem('prohibitedWords', wordsJson)
    Cookies.set('prohibitedWords', wordsJson, { expires: 365 })
  }

  const addProhibitedWord = (word: string) => {
    const trimmedWord = word.trim().toLowerCase()
    if (trimmedWord && !prohibitedWords.value.includes(trimmedWord)) {
      prohibitedWords.value.push(trimmedWord)
      saveProhibitedWords()
    }
  }

  const removeProhibitedWord = (word: string) => {
    const index = prohibitedWords.value.indexOf(word)
    if (index > -1) {
      prohibitedWords.value.splice(index, 1)
      saveProhibitedWords()
    }
  }

  const resetToDefault = () => {
    prohibitedWords.value = [...DEFAULT_PROHIBITED_WORDS]
    saveProhibitedWords()
  }

  return {
    prohibitedWords,
    loadProhibitedWords,
    addProhibitedWord,
    removeProhibitedWord,
    resetToDefault
  }
})
