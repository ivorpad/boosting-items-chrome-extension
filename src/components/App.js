import React, { Component } from "react";
import "./App.css";
import { extractDomainName } from "../helpers/helpers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loading from "./loading.svg";
import Boosting from "./Boosting";
import Highlights from "./Highlights";
import Promotions from "./Promotions";
import Button from "./Button";
import Loading from "./Loading";
import Notices from "./Notices";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as restApiDataSagaActions } from "../sagas/restApiDataSaga";
import { actions as authSagaActions } from "../sagas/AuthSaga";
import { actions as marketplaceActions } from "../reducers/marketplace";
import { actions as spreadsheetActions } from "../reducers/spreadsheet";
import { actions as spreadsheetSagaActions } from "../sagas/SpreadsheetSaga";
import { actions as noticesActions } from "../reducers/notices";
import { getItemCategory } from "../helpers/helpers";
import { storeToken } from '../helpers/helpers'
import ToastMessage from "./ToastMessage";


const isAwesomeProofing = window.location.pathname.startsWith(
  "/admin/awesome_proofing"
);

toast.configure();

class App extends Component {
  state = {
    isHidden: true,
    submitButtonText: "Submit",
    debugMode: false
  };

  flash = ({data, message}, type) => {
    switch(type) {
      case 'success':
        toast.success(<ToastMessage data={data} isError={false} msg={message}/>, {
          className: 'success-flash',
          autoClose: 2000,
          hideProgressBar: true
        });
        break;
      case 'error':
        toast.error(<ToastMessage data={data} isError={true} msg={message} />, {
          className: 'error-flash',
          closeOnClick: false,
          autoClose: false
        })
        break;
      case 'errorAutoClose':
        toast.error(<ToastMessage data={data} isError={true} msg={message} />, {
          className: 'error-flash',
          closeOnClick: true,
          autoClose: 10000,
          hideProgressBar: true
        })
        break;
      default:
        console.log('Something went wrong')    
    }
  }

  componentDidUpdate(prevProps, _prevState) {
    if(
      prevProps.boosting !== this.props.boosting || 
      prevProps.promotions.selected !== this.props.promotions.selected ||
      prevProps.highlights.selected !== this.props.highlights.selected
    ) {
      
      /* eslint-disable no-undef */
      const tokenData = browser.storage.sync.get(["access_token", "expires_in", "logged"]);
      
      tokenData.then(({access_token}) => {
        
        const tokenInfo = browser.runtime.sendMessage({
          type: "fetchTokenInfo",
          access_token
        });

        tokenInfo.then((response) => {

          if(!response.error) {
            if(response.expires_in < 600) {
              const token = browser.runtime.sendMessage({
                type: "refresh"
              });

              token.then(results => {
                //console.log({ results })
                storeToken(results.access_token, results.expires_in, results.isLoggedIn);
              })
            } 
          } 
          else {
            localStorage.removeItem('session_access_token');
            browser.storage.sync.remove(['access_token', 'expires_in', 'logged']);
            this.props.handleSignOut();
            this.flash({ data: false, message: 'Logged out due to network issues or invalid token. Please login again.' }, 'errorAutoClose');
          }
          
        })
      })
  
    }
  }

  componentDidMount() {

    const { setMarketData, fetchApiData, handleLoginInit } = this.props;

    const submitInfo = JSON.parse(localStorage.getItem('submitInfo'));

    if (submitInfo) {
      if (submitInfo.ok) {
        this.flash({ data: submitInfo.item, message: 'Boost successfully recorded' }, 'success');
        localStorage.removeItem('submitInfo');
      } else {
        this.flash({ data: submitInfo.item, message: 'The item couldn\'t be boosted. Click the button to copy the log and paste it at:'}, 'error');
        localStorage.removeItem('submitInfo');
      }
    }

    const marketDataPayload = this.prepareMarketData();

    if (isAwesomeProofing) {
      setMarketData(marketDataPayload);
    } else {
      const itemUrl = document.querySelector(".t-link.-decoration-none").href;
      getItemCategory(itemUrl).then(category => {
        setMarketData({
          ...marketDataPayload,
          categoryName: category
        });
      });
    }

    /* eslint-disable no-undef */
    browser.storage.sync.get("debugModeValue").then(({ debugModeValue }) => {
      this.setState({
        debugMode: debugModeValue || false
      });
    });

    fetchApiData();
    handleLoginInit();
    this.checkSheetValue();
    this.checkBaseUrlValue();

    if (!isAwesomeProofing) {
      this.setState({
        isHidden: false
      });
    }
  }

  componentWillMount = () => {
    if (isAwesomeProofing) {
      this.bigApproveButton = document.getElementById("approve").children[
        "proofing_action"
      ];

      this.approveButton = document.querySelector(
        ".reviewer-proofing-actions"
      ).firstElementChild;

      if (!window.location.href.endsWith(`library_management`)) {
        this.rejectButton = document.querySelector('a[href="#reject"]');

        this.rejectButton.addEventListener(
          "click",
          this.handleRejectAndHoldButtons
        );
      } else {
        this.disableButton = document.querySelector('a[href="#disable"]');

        this.disableButton.addEventListener(
          "click",
          this.handleRejectAndHoldButtons
        );
      }

      this.holdButton = document.querySelector('a[href="#hold"]');

      this.bigApproveButton.addEventListener(
        "click",
        this.handleBigApproveButton
      );

      this.approveButton.addEventListener("click", this.handleApproveButton);

      this.holdButton.addEventListener(
        "click",
        this.handleRejectAndHoldButtons
      );
    }

    if (!this.props.session.logged) {
      this.setState({
        buttonText: "Logout"
      });
    }
  };

  componentWillUnmount = () => {
    if (isAwesomeProofing) {
      this.bigApproveButton.removeEventListener(
        "click",
        this.handleBigApproveButton
      );
      this.approveButton.removeEventListener("click", this.handleApproveButton);

      if (!window.location.href.endsWith(`library_management`)) {
        this.rejectButton.removeEventListener(
          "click",
          this.handleRejectAndHoldButtons
        );
      } else {
        this.disableButton.removeEventListener(
          "click",
          this.handleRejectAndHoldButtons
        );
      }

      this.holdButton.removeEventListener(
        "click",
        this.handleRejectAndHoldButtons
      );
    }
  };

  prepareMarketData = () => {
    const name = document.getElementById("spec-user-username").textContent;

    let itemName;
    let itemUrl;
    let authorName;
    let itemId;
    let categoryName;

    const getItemId = url => {
      return url.split("/").slice(-1)[0];
    };

    if (isAwesomeProofing) {
      itemName = document.querySelector(".existing-value").innerText;
      itemUrl = document.querySelector(".submission-details > a").href;
      authorName = authorName = document.querySelectorAll(
        'a[title="author profile page"]'
      )[0].innerText;
      itemId = getItemId(itemUrl);

      if (window.location.host === "graphicriver.net") {
        categoryName = Array.from(
          document.querySelectorAll(".submission-details > div > a")
        )[4].innerText;
      } else {
        categoryName = Array.from(
          document.querySelectorAll(".submission-details > div > a")
        ).filter(n => n.pathname.startsWith("/category/"))[0].innerText;
      }
    } else {
      itemName = document.querySelectorAll(
        ".f-input.-type-string.-width-full"
      )[0].value;
      itemUrl = document.querySelector(".t-link.-decoration-none").href;
      const authorNode = document.querySelectorAll(
        ".disable-on-submit.e-form.-layout-horizontal .e-form__group"
      )[1];
      authorName = authorNode.querySelector("a.t-link").innerText;
      itemId = getItemId(itemUrl);
    }

    return {
      name,
      itemName,
      itemUrl,
      authorName,
      itemId,
      categoryName
    };
  };

  handleRejectAndHoldButtons = () => {
    if (!this.state.isHidden) {
      this.setState({
        isHidden: true
      });
    }
  };

  checkSheetValue = () => {
    //eslint-disable-next-line no-undef
    browser.storage.sync.get("sheetIdValue").then(({ sheetIdValue }) => {
      if (!sheetIdValue) {
        const message = `Please set the Google Sheet ID option. Go to the Extension Options Panel.`;
        this.props.showNotice(message, "error");
      } else {
        this.props.setSpreadsheetId(sheetIdValue);
      }
    });
  };

  checkBaseUrlValue = () => {
    //eslint-disable-next-line no-undef
    browser.storage.sync.get("baseUrlValue").then(({ baseUrlValue }) => {
      if (!baseUrlValue) {
        const message = `Please set the WordPress Site URL option. Go to the Extension Options Panel.`;
        this.props.showNotice(message, "error");
      }
    });
  };

  cloneAndChangeButtonAttr = () => {
    const bigApproveButton = document.getElementById("approve").children[
      "proofing_action"
    ];
    const approveAction = document.getElementById("approve");
    const newButton = bigApproveButton.cloneNode(true);

    bigApproveButton.style.display = "none";
    newButton.name = "";
    newButton.value = "";
    newButton.innerText = "Approving item...";
    newButton.style.display = "block";
    newButton.setAttribute("disabled", true);
    approveAction.append(newButton);
  };

  validateFormDataArray = array =>
    Array.isArray(array) && array.length > 0 && typeof array !== "undefined";

  handleBigApproveButton = (e, debug = false) => {
    if (!isAwesomeProofing) {
      e.preventDefault();
      e.target.disabled = true;
    } else {
      if (!this.state.debugMode) {
        this.cloneAndChangeButtonAttr();
      }
    }

    const { person, item } = this.props.currentItem;
    const domain = extractDomainName(window.location.host);
    const range = `${domain}!A2`;

    const {
      highlights,
      promotions,
      session,
      spreadsheet,
      boosting
    } = this.props;

    const payload = {
      range: range,
      majorDimension: "ROWS",
      values: [
        [
          new Date().toLocaleDateString("en-US"),
          person.author,
          item.title,
          item.url,
          item.id,
          item.category,
          person.reviewer,
          boosting,
          this.validateFormDataArray(highlights.selected)
            ? highlights.selected.join(", ")
            : "-",
          this.validateFormDataArray(promotions.selected)
            ? promotions.selected.join(", ")
            : "-"
        ]
      ]
    };

    if (this.state.debugMode) {
      console.log({
        payload
      });
    }

    if (
      this.props.boosting ||
      promotions.selected.length > 0 ||
      highlights.selected.length > 0
    ) {
      this.props.sendDataToSheets(
        session.access_token,
        spreadsheet.sheetId,
        payload
      );
    }
  };

  handleApproveButton = () => {
    this.setState({
      isHidden: !this.state.isHidden
    });
  };

  handleLogin = e => {
    e.preventDefault();
    this.props.handleLoginAction();
  };

  handleLogout = e => {
    /* eslint-disable no-undef */

    e.preventDefault();

    browser.runtime.sendMessage({
      type: "logout"
    });

    this.props.handleSignOut();
  };

  render() {
    if (this.state.debugMode) {
      console.log({
        state: this.state,
        props: this.props
      });
    }

    const { isHidden } = this.state;
    // const { logged } = this.props.session;
    // const { buttonText } = this.props.spreadsheet;
    // const { highlights, promotions } = this.props;

    const { 
      highlights, 
      promotions, 
      spreadsheet: { buttonText }, 
      session: { logged } 
    } = this.props;

    return (
      <div className="App" style={{ padding: "20px" }}>
        {isAwesomeProofing ? <Notices /> : null}
        <Loading
          render={() => {
            const { promotions, highlights } = this.props;

            return (promotions.isFetching || highlights.isFetching) &&
              logged &&
              !isHidden ? (
                <img
                  src={
                    // eslint-disable-next-line no-undef
                    chrome.extension.getURL(loading)
                  }
                  alt="Loading"
                />
              ) : null;
          }}
        />

        {!isHidden ? (
          <React.Fragment>
            <ToastContainer />
            <hr className="app__separator" />
            {!logged && <h4 className="app__title">Item Boosting</h4>}
            <Button
              render={() => {
                return (
                  <button
                    className={logged ? "logout" : "login"}
                    onClick={
                      logged
                        ? e => this.handleLogout(e)
                        : e => this.handleLogin(e)
                    }
                  >
                    {logged ? "Logout" : "Login with Google"}
                  </button>
                );
              }}
            />
            {logged ? (
              <React.Fragment>
                <Boosting />
                {highlights.data.length !== 0 && <Highlights />}
                {promotions.data.length !== 0 && <Promotions />}
                {!isAwesomeProofing ? (
                  <button
                    onClick={e => this.handleBigApproveButton(e)}
                    style={{ width: "20%", marginTop: "20px" }}
                  >
                    {" "}
                    {!buttonText ? "Submit" : buttonText}{" "}
                  </button>
                ) : null}
              </React.Fragment>
            ) : null}

            {this.state.debugMode && logged && (
              <div>
                <button
                  style={{ marginTop: "20px" }}
                  onClick={e => {
                    e.preventDefault();
                    this.handleBigApproveButton(e, this.state.debugMode);
                  }}
                >
                  Submit Payload
              </button>
              </div>
            )}
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

// =============== \REDUX =============== //

const mapStateToProps = ({
  currentItem,
  spreadsheet,
  highlights,
  promotions,
  session,
  boosting,
  notices
}) => {
  return {
    currentItem,
    spreadsheet,
    highlights,
    promotions,
    session,
    boosting,
    notices
  };
};

const { fetchApiData } = restApiDataSagaActions;

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      ...marketplaceActions,
      ...spreadsheetActions,
      ...spreadsheetSagaActions,
      ...noticesActions,
      ...authSagaActions,
      fetchApiData
    },
    dispatch
  );
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

// =============== /REDUX =============== //

export default AppContainer;
