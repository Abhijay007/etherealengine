import { Object3D, Vector3 } from 'three'

import { ComponentDeserializeFunction, ComponentSerializeFunction } from '../../../common/constants/PrefabFunctionType'
import { Entity } from '../../../ecs/classes/Entity'
import { addComponent, getComponent } from '../../../ecs/functions/ComponentFunctions'
import { Object3DComponent } from '../../components/Object3DComponent'
import { SplineComponent, SplineComponentType } from '../../components/SplineComponent'

export const deserializeSpline: ComponentDeserializeFunction = (entity: Entity, data: SplineComponentType) => {
  const obj3d = new Object3D()
  const props = parseSplineProperties(data)

  addComponent(entity, Object3DComponent, { value: obj3d })
  addComponent(entity, SplineComponent, props)
}

export const serializeSpline: ComponentSerializeFunction = (entity) => {
  const component = getComponent(entity, SplineComponent) as SplineComponentType
  if (!component) return

  return {
    splinePositions: component.splinePositions
  }
}

export const parseSplineProperties = (props: any): SplineComponentType => {
  const result = { splinePositions: [] as Vector3[] }

  if (!props.splinePositions) return result

  props.splinePositions.forEach((pos) => result.splinePositions.push(new Vector3(pos.x, pos.y, pos.z)))

  return result
}
