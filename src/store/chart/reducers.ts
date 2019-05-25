import { chartConstants, ChartAction, ChartState } from './types';
const initialState = {
  scaleType: 'linear'
}

export const chart = (state = initialState, action: ChartAction): ChartState  => {
  switch (action.type) {
    case chartConstants.UPDATE_SCALE:{
      return {
        ...state,
        scaleType: action.scaleType
      }
    }
    default:
      return state
  }
}
export default chart
