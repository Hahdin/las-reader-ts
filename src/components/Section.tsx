import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { chartCurve } from '../store/files/actions'
import { AppState } from "../store";
import {DataEntry} from '../store/files/types'

interface SectionInterface {
  section: Array<DataEntry>
  heading: string
  onClickItem: any
}

interface CustomProps {
  vale: string;
  section: string
}
const Section:React.SFC<SectionInterface> = ({ section, heading, onClickItem }) => {
  //let { section, heading, onClickItem } = props
  return (
    <div >
      <ListGroup>
        {
          Object.values(section).map(value => {
            let data = (value.data.length === 0) ? value.mnem : value.data
            data += (value.unit.length > 0) ? ` ( ${value.unit} )` : ''
            return (
              <div style={{ fontSize: '12px' }}>
                {
                  (heading === 'Curve Information') ?
                    <ListGroupItem type={value.mnem} target={heading} onClick={(e:React.SyntheticEvent<any>) => onClickItem(e)} >
                      {`${value.desc}: ${data}`}
                    </ListGroupItem>
                    : <ListGroupItem target={heading}>
                      {`${value.desc}: ${data}`}
                    </ListGroupItem>
                }
              </div>
            )
          })
        }
      </ListGroup>
    </div>
  )
}
// Section.propTypes = {
//   section: PropTypes.object.isRequired,
//   onClickItem: PropTypes.func.isRequired,
// }

const mapStateToProps = (state: AppState, ownProps: any) => {
  return ({
    section: ownProps.section || {},
    heading: ownProps.heading,
  })
}

const mapDispatchToProps = (dispatch: any) => ({
  
  onClickItem: (e: React.SyntheticEvent<{ attributes: Array<any> }>) => {
    console.log('map 2')
    let values = Object.values(e.currentTarget.attributes)
    let ret = false
    values.forEach(v => {
      if (v.name === 'target' && v.nodeValue !== 'Curve Information')
        ret = true
    })
    if (ret)
      return
    let val = Object.values(e.currentTarget.attributes).filter(a => a.name === 'type')
    if (val.length === 0)
      return
    dispatch(chartCurve(val[0].nodeValue))
  }
})
const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Section)

export { connected as Section };