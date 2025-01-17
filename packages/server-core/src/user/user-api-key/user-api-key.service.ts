import { Application } from '../../../declarations'
import { UserApiKey } from './user-api-key.class'
import userDocs from './user-api-key.docs'
import hooks from './user-api-key.hooks'
import createModel from './user-api-key.model'

declare module '@etherealengine/common/declarations' {
  /**
   * Interface for users input
   */
  interface ServiceTypes {
    'user-api-key': UserApiKey
  }
}

export default (app: Application): void => {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }

  const event = new UserApiKey(options, app)
  event.docs = userDocs

  app.use('user-api-key', event)

  const service = app.service('user-api-key')

  service.hooks(hooks)
}
