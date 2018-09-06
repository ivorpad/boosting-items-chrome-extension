import React, { Component } from "react";
import "./App.css";
import Boosting from "./Boosting";
import Highlights from "./Highlights";
import Promotions from "./Promotions";
import Button from "./Button";
import Loading from "./Loading";
import Notices from "./Notices";
import SheetApi from "./helpers/API";
import moment from "moment";
import { actions as restApiDataSagaActions } from "./sagas/restApiDataSaga";
import { actions as authSagaActions } from "./sagas/AuthSaga";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { actions as marketplaceActions } from './reducers/marketplace';
import { actions as spreadsheetActions } from './reducers/spreadsheet';
import {store} from './index'
 
import {
  extractDomainName,
  removeItemBundleCount
} from "./helpers/helpers";
import loading from "./loading.svg";

const domain = extractDomainName(window.location.host);
const range = `${domain}!A2`;

removeItemBundleCount();

class App extends Component {
  state = {
    isLoading: false,
    isLoggedIn: false,
    isHidden: true,
    startTokenRefresh: JSON.parse(localStorage.getItem("start_token_refresh")),
    formData: {
      boosting: "Good",
    },
    notices: [],
    showButton: false
  };

  componentDidMount() {
    const marketDataPayload = this.prepareMarketData();
    this.props.setMarketData(marketDataPayload);
    this.props.fetchApiData();
    this.props.handleLogin();
    this.checkSheetUrlOption();
  }

  componentWillMount = () => {
    this.checkIfLoggedIn();
    this.bigApproveButton = document.getElementById("approve").children["proofing_action"];
    this.bigApproveButton.addEventListener("click",this.handleBigApproveButton);

    this.approveButton = document.querySelector(
      ".reviewer-proofing-actions"
    ).firstElementChild;
    this.approveButton.addEventListener("click", this.handleApproveButton);

    this.exitButton = document.querySelector(
      ".header-right-container"
    ).firstElementChild;
    this.exitButton.addEventListener("click", e => this.handleLogout(e, false));

    this.rejectButton = document.querySelector('a[href="#reject"]');
    this.rejectButton.addEventListener(
      "click",
      this.handleRejectAndHoldButtons
    );

    this.holdButton = document.querySelector('a[href="#hold"]');
    this.holdButton.addEventListener("click", this.handleRejectAndHoldButtons);

    if (!this.state.isLoggedIn) {
      this.setState({
        buttonText: "Logout"
      });
    }
  };

  componentWillUnmount = () => {
    this.bigApproveButton.removeEventListener("click",this.handleBigApproveButton);
    this.approveButton.removeEventListener("click", this.handleApproveButton);
    this.exitButton.removeEventListener("click", this.handleLogout);
    this.rejectButton.removeEventListener("click",this.handleRejectAndHoldButtons);
    this.holdButton.removeEventListener("click", this.handleRejectAndHoldButtons);
  };

  prepareMarketData = () => {
    const intercomSetup = document.getElementById("intercom-setup");
    const { name } = JSON.parse(
      intercomSetup.getAttribute("data-intercom-settings-payload")
    );
    const itemName = document.querySelector(".existing-value").innerText;
    const itemUrl = document.querySelector(".submission-details > a").href;
    const authorName = document.querySelectorAll(
      'a[title="author profile page"]'
    )[0].innerText;
    const itemId = document
      .querySelector(".submission-details > a")
      .href.split("/")
      .slice(-1)[0];

    return {
      name,
      itemName,
      itemUrl,
      authorName,
      itemId
    };
  };

  handleRejectAndHoldButtons = () => {
    if (!this.state.isHidden) {
      this.setState({
        isHidden: true
      });
    }
  };

  checkSheetUrlOption = () => {
    //eslint-disable-next-line no-undef
    chrome.storage.sync.get(["sheetIdValue"], value => {
      if (!value.sheetIdValue) {
        const message = `Please set the Google Sheet ID option. Go to the Extension Options Panel.`;
        this.setState(prevState => {
          return {
            notices: [...prevState.notices, { class: "error", message }]
          };
        });
      } else {
        this.props.setSpreadsheetId(value.sheetIdValue);
      }
    });
  };

  //// fetchDataFromApi = () => {
  //   // eslint-disable-next-line no-undef
  ////       chrome.storage.sync.get()
  ////       .then()
  ////       .catch(e => {
  ////         const message = `Please set the WordPress Site URL option. Go to the Extension Options Panel.`;
  //         // TODO: dispatch action
  ////         this.setState(prevState => {
  ////           return {
  ////             notices: [...prevState.notices, { class: "error", message }]
  ////           };
  ////         });
  ////       });
  ////   });
  //// };

  handleLogin = e => {
    e.preventDefault();

    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage(
      { type: "login" },
      function(response) {
        this.setState({
          isLoggedIn: response.isLoggedIn,
          notices: this.state.notices.filter(notice => notice.type !== "logout")
        });
        if (response.access_token) {
          this.handleRefresh();
        }
      }.bind(this)
    );
  };

  handleRefresh = () => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage(
      { type: "refresh" },
      function(response) {
        console.log(response);
        localStorage.setItem("start_token_refresh", response.startTokenRefresh);
        this.setState({
          startTokenRefresh: JSON.parse(
            localStorage.getItem("start_token_refresh")
          )
        });
      }.bind(this)
    );
  };

  handleLogout = (e, prevent) => {
    if (prevent) {
      e.preventDefault();
    }
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage(
      {type: "logout"},
      function(response) {
        console.log(response);
        this.setState({
          isLoggedIn: response.isLoggedIn
        });
      }.bind(this)
    );
  };

  handleFormData = (values, key) => {
    this.setState(prevState => {
      return {
        formData: {
          ...prevState.formData,
          [key]: values
        }
      };
    });
  };

  // TODO: Improve this method name to also check if the expires_in time is less than 10 minutes
  // so we can re-issue a new token
  checkIfLoggedIn = () => {
    // eslint-disable-next-line no-undef
    chrome.storage.sync.get(
      ["access_token"],
      function(result) {
        fetch(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${
            result.access_token
          }`
        )
          .then(resp => resp.json())
          .then(val => {
            if (val.error_description) {
              throw new Error("Not logged in, please login to continue.");
            } else {
              this.setState({
                isLoggedIn: true
              });
            }
          })
          .catch(err => {
            this.setState(prevState => {
              return {
                isLoggedIn: false,
                notices: [
                  ...prevState.notices,
                  { type: "logout", class: "warning", message: err.message }
                ]
              };
            });
          });
      }.bind(this)
    );
  };

  cloneAndChangeButtonAttr = () => {
    const bigApproveButton = document.getElementById("approve").children["proofing_action"];
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

  validateFormDataArray = array => Array.isArray(array) && array.length > 0 && typeof array !== "undefined";

  handleBigApproveButton = () => {
    this.cloneAndChangeButtonAttr();

    const { formData } = this.state;
    const { person, item } = this.props.currentItem;

    const payload = {
      range: range,
      majorDimension: "ROWS",
      values: [
        [
          moment(Date.now()).format("MM-DD-YYYY"),
          person.author,
          item.title,
          item.url,
          item.id,
          person.reviewer,
          formData.boosting,
          this.validateFormDataArray(this.props.highlights.selected)
            ? this.props.highlights.selected.join(", ")
            : "-",
          this.validateFormDataArray(this.props.promotions.selected)
            ? this.props.promotions.selected.join(", ")
            : "-"
        ]
      ]
    };

    this.postDataToSpreadsheet(payload);
  };

  postDataToSpreadsheet = payload => {
    // eslint-disable-next-line no-undef
    chrome.storage.sync.get(
      ["access_token"],
      result => {
        if (!result.access_token) {
          return;
        }
        SheetApi.defaults.headers.post["Authorization"] = `Bearer ${result.access_token}`;
        SheetApi.post(`/${this.props.sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,payload)
          .then(response => {
            // TODO: Remove
            console.log(response);
          })
          .catch(e => {
            console.log(e.response);
          });
      }
    );
  };

  handleApproveButton = () => {
    this.setState({
      isHidden: !this.state.isHidden
    });
  };

  handleReduxLogin = (e) => {
    e.preventDefault()
    this.props.handleLoginAction();
  }

  handleReduxLogout = (e) => {
    e.preventDefault();
    console.log('send action')
    this.props.handleSignOut();
  }

  render() {
    //console.log(store.getState());
    const {
      notices,
      isLoggedIn,
      isHidden
    } = this.state;

    return (
      <div className="App">
        <Notices notices={notices} />
        <Loading
          render={() => {
            return (this.props.promotions.isFetching || this.props.highlights.isFetching) && isLoggedIn && !isHidden ? (
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
            <hr className="app__separator" />
            <h4 className="app__title">Item Boosting</h4>

            <button onClick={(e) => this.handleReduxLogin(e)}>Login with Redux</button>
            <button onClick={(e) => this.handleReduxLogout(e)}>Signout with Redux</button>

            <Button
              render={() => {
                return (
                  <button
                    className={isLoggedIn ? "logout" : "login"}
                    onClick={
                      isLoggedIn
                        ? e => this.handleLogout(e, true)
                        : this.handleLogin
                    }
                  >
                    {isLoggedIn ? "Logout" : "Login"}
                  </button>
                );
              }}
            />

            {isLoggedIn ? (
              <React.Fragment>
                <Boosting handleFormData={this.handleFormData} />
                <Highlights />
                <Promotions />
              </React.Fragment>
            ) : null}
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

// =============== \REDUX =============== //

const mapStateToProps = state => {
  return ({
    currentItem: state.currentItem,
    sheetId: state.spreadsheet.sheetId,
    highlights: state.highlights,
    promotions: state.promotions
  })
}

const { fetchApiData } = restApiDataSagaActions;
const { handleLogin, handleSignOut, handleLoginAction } = authSagaActions;

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ ...marketplaceActions, ...spreadsheetActions, fetchApiData, handleLogin, handleSignOut, handleLoginAction }, dispatch); 
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

// =============== /REDUX =============== //

export default AppContainer;
