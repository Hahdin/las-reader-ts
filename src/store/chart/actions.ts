import { chartConstants } from './types';
export const updateScale = (scaleType: string) =>{
  return ({
    type: chartConstants.UPDATE_SCALE,
    scaleType: scaleType
  })
}

