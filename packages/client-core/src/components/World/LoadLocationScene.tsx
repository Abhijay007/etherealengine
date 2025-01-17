import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  LocationAction,
  LocationService,
  useLocationState
} from '@etherealengine/client-core/src/social/services/LocationService'
import { useAuthState } from '@etherealengine/client-core/src/user/services/AuthService'
import { dispatchAction } from '@etherealengine/hyperflux'

export const useLoadLocationScene = () => {
  const { t } = useTranslation()
  const authState = useAuthState()
  const locationState = useLocationState()
  const isUserBanned = locationState.currentLocation.selfUserBanned.value
  const userNotAuthorized = locationState.currentLocation.selfNotAuthorized.value

  /**
   * Once we have logged in, retrieve the location data
   */
  useEffect(() => {
    const selfUser = authState.user
    const currentLocation = locationState.currentLocation.location

    const isUserBanned =
      selfUser?.locationBans?.value?.find((ban) => ban.locationId === currentLocation.id.value) != null
    dispatchAction(LocationAction.socialSelfUserBanned({ banned: isUserBanned }))

    if (
      !isUserBanned &&
      !locationState.fetchingCurrentLocation.value &&
      locationState.locationName.value &&
      authState.isLoggedIn.value
    ) {
      LocationService.getLocationByName(locationState.locationName.value)
    }
  }, [authState.isLoggedIn.value, locationState.locationName.value])

  if (isUserBanned) return <div className="banned">{t('location.youHaveBeenBannedMsg')}</div>
  if (userNotAuthorized) return <div className="not-authorized">{t('location.notAuthorizedAtLocation')}</div>

  return null
}
