import React, { Component } from "react";
import "./App.css";
import { extractDomainName, removeItemBundleCount } from "../helpers/helpers";
import loading from "./loading.svg";
import Boosting from "./Boosting";
import Highlights from "./Highlights";
import Promotions from "./Promotions";
import Button from "./Button";
import Loading from "./Loading";
import Notices from "./Notices";
import moment from "moment";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as restApiDataSagaActions } from "../sagas/restApiDataSaga";
import { actions as authSagaActions } from "../sagas/AuthSaga";
import { actions as marketplaceActions } from "../reducers/marketplace";
import { actions as spreadsheetActions } from "../reducers/spreadsheet";
import { actions as spreadsheetSagaActions } from "../sagas/SpreadsheetSaga";
import { actions as noticesActions } from "../reducers/notices";
import { getItemCategory } from '../helpers/helpers'

const isAwesomeProofing = window.location.pathname.startsWith("/admin/awesome_proofing")

class App extends Component {
  state = {
  	isHidden: true,
  	submitButtonText: "Submit"
  };

  componentDidMount() {

    const { setMarketData, fetchApiData, handleLoginInit } = this.props;

    removeItemBundleCount();
    const marketDataPayload = this.prepareMarketData();

    if (isAwesomeProofing) {
      setMarketData(marketDataPayload);
    } else {
      const itemUrl = document.querySelector('.t-link.-decoration-none').href;
      getItemCategory(itemUrl).then( category => {
        setMarketData( { 
          ...marketDataPayload,
          categoryName: category
         });
      })
    }

    
    fetchApiData();
    handleLoginInit();
    this.checkSheetValue();
    this.checkBaseUrlValue();

    if (!isAwesomeProofing) {
      this.setState({
        isHidden: false
      })
    }
  }

  componentWillMount = () => {
    
    if (isAwesomeProofing) {
       this.bigApproveButton = document.getElementById("approve").children["proofing_action"];
       this.approveButton = document.querySelector(".reviewer-proofing-actions").firstElementChild;
       this.exitButton = document.querySelector(".header-right-container").firstElementChild;
       this.rejectButton = document.querySelector('a[href="#reject"]');
       this.holdButton = document.querySelector('a[href="#hold"]');
    

        this.bigApproveButton.addEventListener(
          "click",
          this.handleBigApproveButton
        );

        this.approveButton.addEventListener("click", this.handleApproveButton);

        this.exitButton.addEventListener("click", e => {
          this.props.handleLogout();
        });

        
        this.rejectButton.addEventListener(
          "click",
          this.handleRejectAndHoldButtons
        );

        this.holdButton.addEventListener("click", this.handleRejectAndHoldButtons);
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
      this.exitButton.removeEventListener("click", this.handleLogout);
      this.rejectButton.removeEventListener(
        "click",
        this.handleRejectAndHoldButtons
      );
      this.holdButton.removeEventListener(
        "click",
        this.handleRejectAndHoldButtons
      );
    }
  };

  prepareMarketData = () => {
    const intercomSetup = document.getElementById("intercom-setup");
    const { name } = JSON.parse(
      intercomSetup.getAttribute("data-intercom-settings-payload")
    );

    let itemName;
    let itemUrl;
    let authorName;
    let itemId;
    let categoryName;

    const getItemId = (url) => {
      return url.split("/").slice(-1)[0];
    }
    
    if (isAwesomeProofing) {
      itemName = document.querySelector(".existing-value").innerText;
      itemUrl = document.querySelector(".submission-details > a").href;
      authorName = authorName = document.querySelectorAll(
        'a[title="author profile page"]'
      )[0].innerText;
      itemId = getItemId(itemUrl);
      categoryName = Array.from(document.querySelectorAll('.submission-details > div > a')).filter(n => n.pathname.startsWith('/category/'))[0].innerText;

    } else {
      itemName = document.querySelectorAll('.f-input.-type-string.-width-full')[0].value
      itemUrl = document.querySelector('.t-link.-decoration-none').href;
      const authorNode = document.querySelectorAll('.disable-on-submit.e-form.-layout-horizontal .e-form__group')[1]
      authorName = authorNode.querySelector('a.t-link').innerText;
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
    chrome.storage.sync.get(["sheetIdValue"], value => {
      if (!value.sheetIdValue) {
        const message = `Please set the Google Sheet ID option. Go to the Extension Options Panel.`;
        this.props.showNotice(message, "error");
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

    //TODO: Rename method
  handleBigApproveButton = (e) => {
    
    if (!isAwesomeProofing) {
      e.preventDefault();
      e.target.disabled = true;
    } else {
      this.cloneAndChangeButtonAttr();
    }

    const { person, item } = this.props.currentItem;
    const domain = extractDomainName(window.location.host);
    const range = `${domain}!A2`;

    const { highlights, promotions, session, spreadsheet } = this.props;

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
          item.category,
          person.reviewer,
          this.props.boosting,
          this.validateFormDataArray(highlights.selected)
            ? highlights.selected.join(", ")
            : "-",
          this.validateFormDataArray(promotions.selected)
            ? promotions.selected.join(", ")
            : "-"
        ]
      ]
    };
    this.props.sendDataToSheets(session.access_token, spreadsheet.sheetId, payload);
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
    e.preventDefault();
    this.props.handleSignOut();
  };

  handleAdminEditSubmit = (e) => {
    e.preventDefault();

  }

  render() {
    const { isHidden } = this.state;
    const { logged } = this.props.session;
    const { buttonText } = this.props.spreadsheet;
    return (
      <div className="App" style={{ padding: '20px' }}>
        {
        	isAwesomeProofing ? < Notices / > : null
        }
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
            <hr className="app__separator" />
            {!logged && <h4 className="app__title">Item Boosting</h4> }
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
                <Highlights />
                <Promotions />
                {
                	!isAwesomeProofing ?
                  <button onClick={e => this.handleBigApproveButton(e)} style={{ width: '20%', marginTop: '20px' }}> { !buttonText ? "Submit" : buttonText } </button>
                : null  }
              </React.Fragment>
            ) : null}
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