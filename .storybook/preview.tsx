import { Decorator, Preview } from '@storybook/react'
import { ThemeProvider } from '@mui/material/styles'

import { themes } from '@storybook/theming'
import { addons } from '@storybook/addons'
import React, {
  createElement,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import { DARK_MODE_EVENT_NAME, useDarkMode } from 'storybook-dark-mode'
import { DocsContainer, DocsContainerProps } from '@storybook/blocks'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { darkTheme } from '@/themes/dark-theme'
import { lightTheme } from '@/themes/light-theme'
// get channel to listen to event emitter
const channel = addons.getChannel()

// create a component that listens for the DARK_MODE event
const ThemeWrapper = (props: PropsWithChildren) => {
  // this example uses hook but you can also use class component as well
  const [isDark, setDark] = useState(false)

  useEffect(() => {
    // listen to DARK_MODE event
    channel.on(DARK_MODE_EVENT_NAME, setDark)

    return () => channel.off(DARK_MODE_EVENT_NAME, setDark)
  }, [channel, setDark])

  // render your custom theme provider
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      {props.children}
    </ThemeProvider>
  )
}

export const decorators: Array<Decorator> = [
  (Story) => (
    <>
      <Story />
    </>
  ),
  (renderStory) => <ThemeWrapper>{renderStory()}</ThemeWrapper>,
]

const preview: Preview = {
  parameters: {
    darkMode: {
      classTarget: 'html',
      stylePreview: true,
      // Set the initial theme
      current: 'light',
      // Override the default dark theme
      dark: { ...themes.dark, appBg: 'black' },
      // Override the default light theme
      light: { ...themes.normal },
    },
    options: {
      storySort: {
        order: [
          'Principal',
          'Átomos',
          'Moléculas',
          'Organismos',
          'Plantillas',
          'Páginas',
        ],
        locales: 'es',
      },
    },
    backgrounds: {
      disable: true,
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      //👇 The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
      //👇 Your own default viewport
    },
    docs: {
      container: (props: DocsContainerProps) => {
        const isDark = useDarkMode()
        const currentProps = { ...props }
        currentProps.theme = isDark
          ? { ...themes.dark, appPreviewBg: 'black', barHoverColor: '' }
          : {
              ...themes.light,
              appPreviewBg: 'white',
              barHoverColor: '',
            }
        return createElement(DocsContainer, currentProps)
      },
    },
  },
}

export default preview
