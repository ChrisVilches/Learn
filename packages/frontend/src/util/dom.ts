let bodyTransitionsApplied = false

export const applyBodyTransitions = (): void => {
  if (!bodyTransitionsApplied) {
    bodyTransitionsApplied = true
    setTimeout(() => {
      bodyTransitionsApplied = true
      document.querySelector('body')?.setAttribute('class', 'transition-colors duration-500')
    })
  }
}

export const applyTheme = (themeName: string): void => {
  if (themeName === 'dark') {
    document.querySelector('html')?.classList.add('dark')
  } else {
    document.querySelector('html')?.classList.remove('dark')
  }
}

export const getFullTitle = (subtitle = ''): string => {
  const mainTitle = 'Learn App'

  if (subtitle.length === 0) {
    return mainTitle
  }

  return `${mainTitle} - ${subtitle}`
}
