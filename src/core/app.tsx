import 'core-js'

import type { FunctionComponent as FC } from 'preact'
import { h, render, Fragment } from 'preact'
import { useEffect } from 'preact/hooks'
import { Provider } from 'unistore-hooks'

import { listenAppErrors, listenAppInstall } from '~/core/actions'
listenAppErrors()
listenAppInstall()

import { store } from '~/core/store'
import { updateUser } from '~/core/actions'
import { useAppRoute, useUser } from '~/core/hooks'
import { checkIsIOSSafari } from '~/tools/detect-device'
import { registerSW } from '~/sw'
import { IntroLazy } from '~/features/intro'
import { AuthLazy } from '~/features/auth'
import { StorageLazy } from '~/features/storage'
import { WidgetsLazy } from '~/widgets'
import { IOSInstallPromptLazy } from '~/ui/elements/ios-install-prompt'
import { FallbackSidebar } from '~/ui/elements/fallback-sidebar'
import {
  PreventContextMenu, PreventScale, PreventDragAndDrop,
  ApplyTheme, ApplyLocale
} from '~/ui/handlers'

const App: FC = () => {
  const { isIntroAppRoute } = useAppRoute()
  const { user, isLegacyUser } = useUser()

  useEffect(() => {
    if (!isLegacyUser) return
    updateUser()
  }, [isLegacyUser])

  return (
    <Fragment>
      {isIntroAppRoute ? (
        <IntroLazy/>
      ) : isLegacyUser ? (
        <FallbackSidebar/>
      ) : user ? (
        <StorageLazy/>
      ) : (
        <AuthLazy/>
      )}
      <WidgetsLazy/>

      <ApplyTheme/>
      <ApplyLocale/>

      <PreventContextMenu/>
      <PreventScale/>
      <PreventDragAndDrop/>

      {checkIsIOSSafari() && (
        <IOSInstallPromptLazy/>
      )}
    </Fragment>
  )
}

registerSW()

render(
  <Provider value={store}>
    <App/>
  </Provider>,
  document.body
)
