import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { openFile, parseFile } from '../store/files/actions'
import { AppState } from "../store";
interface LasInputProps {
   filter: string;
   onChange: any
}
const LasInputFile: React.SFC<LasInputProps> = ({ filter, onChange }) => {
   const style = { float: 'left' as 'left', backgroundColor: 'lightgrey' as 'lightgrey' }
   return (
      <div>
         <input id='file-input' type='file' name='name'
            accept={filter} style={style} className='form-control'
            onChange={e => { onChange(e) }}
         />
      </div>
   )
}
LasInputFile.propTypes = {
   onChange: PropTypes.func.isRequired
}
const mapStateToProps = (state: AppState) => {
   return ({ filter: '.las' })//files allowed
}
const parse = (dispatch: any, data: any) => {
   return new Promise((resolve, reject) => {
      dispatch(parseFile(data))
      resolve(true)
   })
}
const mapDispatchToProps = (dispatch: any) => ({
   onChange: (e: React.SyntheticEvent<{ files: Array<File> }>) => {
      const seek = () => {
         if (offset >= file.size) {
            return
         }
         let slice = file.slice(offset, offset + chunk);
         fr.readAsText(slice);
      }
      const fl = e.currentTarget.files
      if (!fl.length) return
      //read in chunks
      let chunk = 1024 * 100// 100kb
      let offset = 0
      const fr: FileReader = new FileReader()
      let file: File = fl[0]
      fr.onload = (event: ProgressEvent) => {
         dispatch(openFile(fl[0], []))
         parse(dispatch, fr.result)
            .then(pr => {
               offset += chunk
               seek()
            })
            .catch(reason => {
               console.log(reason)
            })
      }
      fr.onerror = (error) =>{
         console.log('error', error);
         return
      }
      fr.onabort = (error) =>{
         console.log('abort', error);
         return
      }
      seek()
   }
})
const connected = connect(
   mapStateToProps,
   mapDispatchToProps
)(LasInputFile)
export { connected as LasInputFile };