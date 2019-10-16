import React from 'react'
import { copyToClipboard } from "../helpers/helpers";

function ToastMessage({ data, msg, isError }) {
  return (
    <div class="toasty">
      {isError && data ? (
        <div>
          <h3><span>!!!ATTENTION:</span> {data.item}</h3>
          <p>{msg} <a href="slack://channel?team=T0253B9P9&id=CPFBU2MV4">#help-boosting-tool</a></p>
          <button className="copy-log" onClick={(e) => {
            e.preventDefault();
            copyToClipboard(JSON.stringify(data))
          }}>Copy Log</button>
        </div>
      ) : <p>{msg}</p>}
    </div>
  )
}

export default ToastMessage
