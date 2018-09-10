import React, {Fragment} from 'react'
import Notice from "./Notice";
import {connect} from 'react-redux';
import { actions as noticesActions } from './reducers/notices'

const Notices = ({notices}) => {
  return (
    <Fragment>
    {notices.length
        ? notices.map(notice => {
          return (
            <Notice class={notice.class}>
              <p>
                <b>Envato Market Item Boosting:</b> {notice.message}
              </p>
            </Notice>
          );
        })
        : null}
    </Fragment>
  )
}

const mapStateToProps = (state) => ({
  notices: state.notices
})

const NoticesContainer = connect(
  mapStateToProps,
  ...noticesActions
)(Notices)

export default NoticesContainer;