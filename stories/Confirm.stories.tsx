import * as React from 'react'
import { withNextRouter } from 'storybook-addon-next-router'
import ConfirmComponent from '../pages/users/confirm'

export default {
  title: 'Pages/confirm',
  decorators: [withNextRouter]
}

export const InvalidString = () => <ConfirmComponent />

export const ValidString = () => {
  return <ConfirmComponent />
}

ValidString.story = {
  parameters: {
    nextRouter: {
      path: '/users/confirm',
      asPath: '/users/confirm',
      query: {
        confirm: '232432'
      }
    }
  }
}
