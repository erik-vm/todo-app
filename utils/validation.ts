export const containsProhibitedWords = (text: string, prohibitedWords: string[]): boolean => {
  const lowerCaseText = text.toLowerCase()
  return prohibitedWords.some(word =>
    lowerCaseText.includes(word.toLowerCase())
  )
}

export const getProhibitedWordsFromText = (text: string, prohibitedWords: string[]): string[] => {
  const lowerCaseText = text.toLowerCase()
  return prohibitedWords.filter(word =>
    lowerCaseText.includes(word.toLowerCase())
  )
}
