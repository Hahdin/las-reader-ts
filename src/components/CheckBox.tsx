import * as React from 'react'
import { connect } from 'react-redux'
import { updateScale } from '../store/chart/actions'
import { AppState } from "../store";
interface CheckBoxProps {
  value: any;
  onClick: Function
}

const CheckBox:React.SFC<CheckBoxProps> = ({ value, onClick }) => {
  let style = { float: 'left' as 'left',  }
  return (
    <div style={style}>
      <label style={style}><input type='checkbox' name='scaleType' value={value} 
        onClick={e => {
          onClick(e)
        }}
      />{` ${value} `}</label>
    </div>
  )
}
const mapStateToProps = (state: AppState) => {
  return ({
     value: state.chart.scaleType || 'linear'
  })
}
const mapDispatchToProps = (dispatch: any) => ({
  onClick: (e:React.SyntheticEvent<{ value: string }>) => {
    if (e.currentTarget.value === 'linear')
      dispatch(updateScale('logarithmic'))
    else
      dispatch(updateScale('linear'))
  }
})
const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckBox)

export { connected as CheckBox };