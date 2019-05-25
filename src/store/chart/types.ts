export const chartConstants = {
   UPDATE_SCALE: 'UPDATE_SCALE',
 };

 export interface ChartAction {
   type: string
   scaleType: string
 }
 
 export interface ChartState {
   scaleType: string
 }