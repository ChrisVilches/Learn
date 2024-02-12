import { useEffect, useState } from 'react'
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri'
import '../styles/theme-toggle.css'
import { applyBodyTransitions, applyTheme } from '../util/dom'

const DEFAULT_THEME = 'dark'

const saveTheme = (themeName: string): void => {
  window.localStorage.setItem('theme', themeName)
}

export function ThemeToggle (): JSX.Element {
  const [darkTheme, setDarkTheme] = useState(true)

  useEffect(() => {
    const themeName: string = window.localStorage.getItem('theme') ?? DEFAULT_THEME
    setDarkTheme(themeName === 'dark')
    applyTheme(themeName)
    applyBodyTransitions()
  }, [])

  const toggleTheme = (): void => {
    const theme = !darkTheme
    setDarkTheme(theme)
    applyTheme(theme ? 'dark' : 'light')
    saveTheme(theme ? 'dark' : 'light')
  }

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="relative mb-5 cursor-pointer">
        <input checked={darkTheme} type="checkbox" className="sr-only peer" onChange={toggleTheme}/>
        <div className='theme-toggle'>
          <RiMoonClearLine className={`text-yellow-500 w-6 h-6 ${darkTheme ? 'visible' : 'invisible'}`}/>
          <RiSunLine className={`text-gray-600 w-6 h-6 ${darkTheme ? 'invisible' : 'visible'}`}/>
        </div>
      </label>
    </>
  )
}
