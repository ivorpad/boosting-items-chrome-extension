import React, {Fragment} from 'react'
import Notice from "./Notice";
import {connect} from 'react-redux';

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
  null
)(Notices)

export default NoticesContainer;