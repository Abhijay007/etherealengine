import { getState } from '@etherealengine/hyperflux'

import { Engine } from '../../ecs/classes/Engine'
import { EngineState } from '../../ecs/classes/EngineState'
import { defineQuery } from '../../ecs/functions/ComponentFunctions'
import { defineSystem } from '../../ecs/functions/SystemFunctions'
import { TransformComponent } from '../../transform/components/TransformComponent'
import { Network } from '../classes/Network'
import { NetworkObjectAuthorityTag } from '../components/NetworkObjectComponent'
import { NetworkObjectComponent } from '../components/NetworkObjectComponent'
import { createDataWriter } from '../serialization/DataWriter'
import { ecsDataChannelType } from './IncomingNetworkSystem'

/***********
 * QUERIES *
 **********/

export const networkTransformsQuery = defineQuery([NetworkObjectComponent, TransformComponent])
const authoritativeNetworkTransformsQuery = defineQuery([
  NetworkObjectAuthorityTag,
  NetworkObjectComponent,
  TransformComponent
])

const serializeAndSend = (serialize: ReturnType<typeof createDataWriter>) => {
  const ents = getState(EngineState).isEditor ? networkTransformsQuery() : authoritativeNetworkTransformsQuery()
  if (ents.length > 0) {
    const userID = Engine.instance.userId
    const network = Engine.instance.worldNetwork as Network
    const peerID = network.peerID
    const data = serialize(network, userID, peerID, ents)

    // todo: insert historian logic here

    if (data.byteLength > 0) {
      // side effect - network IO
      // delay until end of frame
      Promise.resolve().then(() => network.transport.bufferToPeer(ecsDataChannelType, network.hostPeerID, data))
    }
  }
}

const serialize = createDataWriter()

const execute = () => {
  Engine.instance.worldNetwork && serializeAndSend(serialize)
}

export const OutgoingNetworkSystem = defineSystem({
  uuid: 'ee.engine.OutgoingNetworkSystem',
  execute
})
