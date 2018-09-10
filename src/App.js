import React, { Component } from "react";
import "./App.css";
import Boosting from "./Boosting";
import Highlights from "./Highlights";
import Promotions from "./Promotions";
import Button from "./Button";
import Loading from "./Loading";
import Notices from "./Notices";
import moment from "moment";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { actions as restApiDataSagaActions } from "./sagas/restApiDataSaga";
import { actions as authSagaActions } from "./sagas/AuthSaga";
import { actions as marketplaceActions } from './reducers/marketplace';
import { actions as spreadsheetActions } from './reducers/spreadsheet';
import { actions as spreadsheetSagaActions } from './sagas/SpreadsheetSaga';
 
import { extractDomainName, removeItemBundleCount } from "./helpers/helpers";
import loading from "./loading.svg";


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
    this.props.handleLoginInit()
    this.checkSheetValue();
    this.checkBaseUrlValue();
  }

  componentWillMount = () => {
    this.bigApproveButton = document.getElementById("approve").children["proofing_action"];
    this.bigApproveButton.addEventListener("click",this.handleBigApproveButton);

    this.approveButton = document.querySelector(
      ".reviewer-proofing-actions"
    ).firstElementChild;
    this.approveButton.addEventListener("click", this.handleApproveButton);

    this.exitButton = document.querySelector(
      ".header-right-container"
    ).firstElementChild;
    this.exitButton.addEventListener("click", e => {
      this.handleLogout(e, false);
      this.props.handleLogout();
    });

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

  checkSheetValue = () => {
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

  checkBaseUrlValue = () => {
    //eslint-disable-next-line no-undef
    chrome.storage.sync.get(["baseUrlValue"], value => {
      if (!value.baseUrlValue) {
        const message = `Please set the WordPress Site URL option. Go to the Extension Options Panel.`;
        this.setState(prevState => {
          return {
            notices: [...prevState.notices, { class: "error", message }]
          };
        });
      }
    })

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
    const domain = extractDomainName(window.location.host);
    const range = `${domain}!A2`;

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
    this.props.sendDataToSheets(this.props.session.access_token, this.props.sheetId, payload);
  };

  handleApproveButton = () => {
    this.setState({
      isHidden: !this.state.isHidden
    });
  };

  handleLogin = (e) => {
    e.preventDefault()
    this.props.handleLoginAction();
  }

  handleLogout = (e) => {
    e.preventDefault();
    this.props.handleSignOut();
  }

  render() {
    console.log('from render', this.props);
    const {
      notices,
      isHidden
    } = this.state;

    const { logged } = this.props.session

    return (
      <div className="App">
        <Notices notices={notices} />
        <Loading
          render={() => {
            return (this.props.promotions.isFetching || this.props.highlights.isFetching) && logged && !isHidden ? (
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
                    {logged ? "Logout" : "Login"}
                  </button>
                );
              }}
            />

            {logged ? (
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
    promotions: state.promotions,
    session: state.session
  })
}

const { fetchApiData } = restApiDataSagaActions;


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    ...marketplaceActions, 
    ...spreadsheetActions, 
    ...spreadsheetSagaActions,
    fetchApiData, 
    ...authSagaActions }, 
    dispatch); 
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

// =============== /REDUX =============== //

export default AppContainer;
