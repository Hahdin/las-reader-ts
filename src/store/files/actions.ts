import {
   fileConstants,
   DataEntry,

} from './types';
import configureStore from '../../store'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux';
import { reject } from 'q';
const store = configureStore()

let versionPassed = false

export const addSection = (section: string) => {
   return ({
     type: fileConstants.ADD_SECTION,
     section: section,
   })
 }
 export const currentSection = (section: string) =>{
   return ({
     type: fileConstants.CURRENT_SECTION,
     section: section
   })
 }
 export const reset = () =>{
   return ({
     type: fileConstants.RESET_LAS,
   })
 }
 export const addData = (section: string, data: DataEntry) =>{ 
   return ({
     type: fileConstants.ADD_DATA,
     section: section,
     data: data,
   })
 }

 export const addAscii = ( data: Array<Array<number>>) =>{
   return ({
     type: fileConstants.ADD_ASCII,
     asciiData: data,
   })
 }

 export const openFile = (file: File, rawData: Array<string>) => {
   console.log(rawData)
   return ({
     type: fileConstants.OPEN_FILE,
     file: file,
     raw: rawData
   })
 }
 export const chartCurve = (curve : string) =>{
   return ({
     type: fileConstants.CHART_CURVE,
     curve: curve
   })
 }
 export const getLine = (rawData: string) => {
  var i = rawData.indexOf('\n')
  let line = ''
  if (i < 0)
    return { line, rawData }
  line = rawData.slice(0, i).replace(/\"/g, '')
  if (!line.length) {
    console.log('empty')
    return { line, rawData }
  }
  if (!line || line.length <= 0) {
    console.log('line failed')
    return { line, rawData }
  }
  line = line.replace(/\s+/g, ' ')
  line = line.replace(/\t/g, ' ')
  //remove from file
  if (i === 0)
    console.log('zero index')
  rawData = rawData.slice(i > 0 ? i + 1 : 0)
  return { line, rawData }
}
const checkVersion = (raw:string) => {
  //console.log(raw)
  let i = raw.indexOf('\n')
  if (i >= 0) {
    let line = raw.slice(0, i)
    while (line) {
      if (line.search(/VERS/i) >= 0) {
        if (line.search(/3/i) >= 0) {
          return false
        }
        if (line.search(/2/i) >= 0) {
          versionPassed = true
          return true
        }
      }
      raw = raw.slice(i > 0 ? i + 1 : 0)
      i = raw.indexOf('\n')
      if ( i < 0)
        return true
      line = raw.slice(0, i)
    }
  } else {
    return true
  }
  return true
}

const getSections = (line : string) => {
  if (line.search(/~a\w?/i) >= 0) {
    line = 'ASCII';
  }
  if (line.search(/~V\w?/i) >= 0) {
    line = 'VERSION';
  }
  if (line.search(/~W\w?/i) >= 0) {
    line = 'WELL';
  }
  if (line.search(/~C\w?/i) >= 0) {
    line = 'CURVE_INFORMATION';
  }
  if (line.search(/~O\w?/i) >= 0) {
    line = 'OTHER_INFORMATION';
  }
  if (line.search(/~P\w?/i) >= 0) {
    line = 'PARAMETER_INFORMATION';
  }
  return line;
}


export const parseFile = (rawData: string):
ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  console.log('parse')
return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
   return new Promise<void>((resolve) => {
      if (!versionPassed && !checkVersion(rawData.slice(0))) {
         alert(`*Only LAS Version 2.0 files are supported`)
         reject(`*Only LAS Version 2.0 files are supported`)
        // throw Error('Bad Version')
       }
       let data = getLine(rawData)
       let line = data.line
       rawData = data.rawData// rawData with line removed
       //tracking
       let section = ''//the current section we are processing
       let ascii = []
       while (line) {
         //if this is not the first chunk(section), check what section we are in
         line = line.trim()
         //let chunk = parseInt(store.getState().files.chunk, 10)
         let chunk = store.getState().files.chunk
         if (chunk > 1) {
           section = store.getState().files.section
         }
         if (line.startsWith('#') || line.length === 0) {//comment or empty line, skip
           data = getLine(rawData)
           line = data.line
           rawData = data.rawData
           continue
         }
         if (line.search(/~/) === 0) {//section heading
           line = getSections(line)
           section = line
           dispatch(addSection(line))
           dispatch(currentSection(section))
           if (section === 'CURVE_INFORMATION') {
             dispatch(reset())//reset at start of parsing ascii block
           }
         }
         else if (section === 'ASCII') {
           let values = line.split(/\s+/g).map(val => {
             return parseFloat(val)
           })
           ascii.push(values)
         }
         else if (section === 'OTHER_INFORMATION') {
           //skip for now
         }
         else {//not a heading
           //format MNEM.UNIT Data after unit space until colon: Description
           let mnem = '', unit = '', data = '', desc = ''
           let rgData = /\s*([^.:\s]+)\s*[.]([^:\s]*)\s+(.*)[:]\s*(.*)/.exec(line)
           /**
             MNEM = mnemonic. This mnemonic can be of any length but must not contain any internal
             spaces, dots, or colons. Spaces are permitted in front of the mnemonic and between the
             end of the mnemonic and the dot.   
             
             UNITS = units of the mnemonic (if applicable). The units, if used, must be located directly
             after the dot. There must be no spaces between the units and the dot. The units can be of
             any length but must not contain any colons or internal spaces.
   
             DATA = value of, or data relating to the mnemonic. This value or input can be of any length
             and can contain spaces, dots or colons as appropriate. It must be preceded by at least one
             space to demarcate it from the units and must be to the left of the last colon in the line.
   
             DESCRIPTION = description or definition of the mnemonic. It is always located to the right
             of the last colon. The length of the line is no longer limited.
             * 
            */
   
           if ( rgData){
             mnem = rgData[1].trim()
             unit = rgData[2].trim()
             data = rgData[3].trim()
             desc = rgData[4].trim()
           } else{
             console.log('??', line)
             return
           }
   
           mnem.toUpperCase() 
           let dataEntry = {
             mnem: mnem,
             unit: unit,
             data: data,
             desc: desc
           }
           if ( section === "VERSION" && mnem === 'WRAP'){
             let t = data
             t.toUpperCase()
             t = t.trim()
             if (t === 'YES'){
               alert('WRAPPED Las files are not supported')
               throw Error('WRAPPED Las files are not supported')
             }
           }
           dispatch(addData(section, dataEntry))
         }
         data = getLine(rawData)
         line = data.line
         rawData = data.rawData
       }
       if (ascii.length) {
         dispatch(addAscii(ascii))
       }
   



      resolve();
   })
}
}

