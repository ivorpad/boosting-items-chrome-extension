import React, {Fragment} from 'react'
import Notice from "./Notice";

export default ({notices}) => {
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
