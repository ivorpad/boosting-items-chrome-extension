import React from 'react'
import { copyToClipboard } from "../helpers/helpers";
import { connect } from 'react-redux'
import { toast } from 'react-toastify';

class ToastMessage extends React.Component {

  state = {
    submitted: false
  }  

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.spreadsheet.submitted !== prevState.submitted) {
      return {
        submitted: nextProps.spreadsheet.submitted
      }
    }

    else {
      return null;
    }
  }

  handleTryAgain = (e, data) => {
    e.preventDefault();

    /* eslint-disable no-undef */
    browser.storage.sync.get('sheetIdValue').then(({ sheetIdValue }) => {
      this.props.sendDataToSheets(this.props.access_token, sheetIdValue, this.props.data.item);
    });

  }

  render() {

    if (this.state.submitted) {

     this.props.closeToast();

      toast.success(() => <p>Boost successfully recorded</p>, {
        className: 'success-flash',
        autoClose: 20000,
        hideProgressBar: true
      });

      localStorage.removeItem('submitInfo')
    }

    const { data, msg, isError, title } = this.props;
    return (
      <div class="toasty">
        {isError && data.item ? (
          <div>
            {/* <h3><span>!!!ATTENTION:</span> {data.item}</h3> */}
            <p>{msg} <a href="slack://channel?team=T0253B9P9&id=CPFBU2MV4">#help-boosting-tool</a></p>
            {this.props.access_token && (
              <button className="action" onClick={this.handleTryAgain}>Try Again</button>
            )}
            <button className="action" onClick={(e) => {
              e.preventDefault();
              copyToClipboard(JSON.stringify(data))
            }}>Copy Log</button>
          </div>
        ) : (
            <React.Fragment>
              {title && <h3> {title} </h3>}
              <p>{msg}</p>
            </React.Fragment>
        )}
      </div>
    )
  }
}

const mapStateToProps = ({spreadsheet}) => {
  return {
    spreadsheet
  }
}

const ToastMessageContainer = connect(mapStateToProps)(ToastMessage);

export default ToastMessageContainer
