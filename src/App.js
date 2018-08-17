import React, { Component } from "react";
import "./App.css";
import Boosting from "./Boosting";
import Highlights from "./Highlights";
import Promotions from "./Promotions";
import Button from "./Button";
import Notice from "./Notice";
import axios from "axios";
import SheetApi from "./helpers/API";
import moment from "moment";
import {
  extractDomainName,
  removeItemBundleCount,
  getDataFrom
} from "./helpers/helpers";
import loading from "./loading.svg";

const domain = extractDomainName(window.location.host);
const range = `${domain}!A2`;

removeItemBundleCount();

/*eslint-enable no-undef*/

class App extends Component {
  state = {
    reviewerName: "",
    authorName: "",
    itemUrl: "",
    itemName: "",
    itemId: "",
    sheetId: "",
    highlights: [],
    promotions: [],
    inputValue: "",
    isLoading: false,
    isLoggedIn: false,
    isHidden: true,
    startTokenRefresh: JSON.parse(localStorage.getItem("start_token_refresh")),
    marketplace: "",
    formData: {
      boosting: "Good",
      highlights: [],
      promotions: []
    },
    buttonText: "Login with Google",
    notices: []
  };
  componentDidMount() {
    const intercomSetup = document.getElementById("intercom-setup");
    const { name } = JSON.parse(
      intercomSetup.getAttribute("data-intercom-settings-payload")
    );
    const itemName = document.querySelector(".existing-value").innerText;
    const itemUrl = document.querySelector(".submission-details > a").href;
    const authorName = document.querySelectorAll('a[title="author profile page"]')[0].innerText;
    const itemId = document.querySelector('.submission-details').firstElementChild.href.split('/').slice(-1)[0]

    this.setState({
      isLoading: true,
      reviewerName: name,
      itemName,
      itemUrl,
      authorName,
      itemId
    });

    /*eslint-disable no-undef*/
    chrome.storage.sync.get(
      ["baseUrlValue"],
      function(value) {
        axios
          .all([
            axios.get(
              `https://${value.baseUrlValue}/wp-json/wp/v2/post_type_promotion`
            ),
            axios.get(
              `https://${value.baseUrlValue}/wp-json/wp/v2/post_type_highlight`
            ),
            axios.get(`https://${value.baseUrlValue}/wp-json/wp/v2/marketplace`)
          ])
          .then(
            axios.spread(
              (promotionsResponse, highlightsResponse, marketplaceResponse) => {
                if (
                  promotionsResponse.status === 200 &&
                  highlightsResponse.status === 200 &&
                  marketplaceResponse.status === 200
                ) {
                  let { data: promotions } = promotionsResponse;
                  let { data: highlights } = highlightsResponse;

                  const marketplace = marketplaceResponse.data.filter(
                    market => {
                      return market.name === domain;
                    }
                  );

                  highlights = getDataFrom(highlights, marketplace);
                  promotions = getDataFrom(promotions, marketplace);

                  this.setState({
                    promotions,
                    highlights,
                    isLoading: false
                  });
                }
              }
            )
          )
          .catch(e => {
            const message = `Please set the WordPress Site URL option. Go to the Extension Options Panel.`;
            this.setState(prevState => {
              return {
                notices: [...prevState.notices, { class: "error", message }]
              };
            });
          });
      }.bind(this)
    );

    /* eslint-disable no-undef */
    chrome.storage.sync.get(
      ["sheetIdValue"],
      function(value) {
        if(!value.sheetIdValue) {
          const message = `Please set the Google Sheet ID option. Go to the Extension Options Panel.`;
          this.setState(prevState => {
            return {
              notices: [...prevState.notices, { class: "error", message }]
            }
          })
        } else {
          this.setState({
            sheetId: value.sheetIdValue
          });
        }
      }.bind(this)
    );
    /* eslint-enable no-undef */

    // workaround to fix undefined .settings in jQuery validation  
    const script = document.createElement('script');
    script.textContent = "$('#promotions').validate()";
    (document.head || document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);  
  }

  componentWillMount = () => {
    this.checkIfLoggedIn();
    const bigApproveButton = document.getElementById("approve").children[
      "proofing_action"
    ];
    bigApproveButton.addEventListener("click", this.handleBigApproveButton);

    const approveButton = document.querySelector(".reviewer-proofing-actions")
      .firstElementChild;
    approveButton.addEventListener("click", this.handleApproveButton);

    const exitButton = document.querySelector(".header-right-container")
      .firstElementChild;
    exitButton.addEventListener("click", (e) => this.handleLogout(e, false));

    if (!this.state.isLoggedIn) {
      this.setState({
        buttonText: "Logout"
      });
    }
  };

  handleLogin = e => {
    e.preventDefault();

    /*eslint-disable no-undef*/
    chrome.runtime.sendMessage(
      {
        type: "login"
      },
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

    /*eslint-enable no-undef*/
  };

  handleRefresh = () => {
    /*eslint-disable no-undef*/
    chrome.runtime.sendMessage(
      {
        type: "refresh"
      },
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
    /*eslint-enable no-undef*/
  };

  handleLogout = (e, prevent) => {
    if(prevent) {
      e.preventDefault();
    }
    /*eslint-disable no-undef*/
    chrome.runtime.sendMessage(
      {
        type: "logout"
      },
      function(response) {
        console.log(response);
        this.setState({
          isLoggedIn: response.isLoggedIn
        });
      }.bind(this)
    );
    /*eslint-enable no-undef*/
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
    /*eslint-disable no-undef*/
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
    /*eslint-enable no-undef*/
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

  handleBigApproveButton = e => {
    this.cloneAndChangeButtonAttr();
    const { 
      itemUrl, 
      itemName, 
      reviewerName, 
      formData, 
      authorName,
      itemId
    } = this.state;

    const dataToInsert = {
      range: range,
      majorDimension: "ROWS",
      values: [
        [
          moment(Date.now()).format("MM-DD-YYYY"),
          authorName,
          itemName,
          itemUrl,
          itemId,
          reviewerName,
          formData.boosting,
          this.validateFormDataArray(formData.highlights)
            ? formData.highlights.join(", ")
            : "-",
          this.validateFormDataArray(formData.promotions)
            ? formData.promotions.join(", ")
            : "-"
        ]
      ]
    };

    /*eslint-disable no-undef*/
    chrome.storage.sync.get(
      ["access_token"],
      function(result) {
        if (!result.access_token) {
          return;
        }
        SheetApi.defaults.headers.post["Authorization"] = `Bearer ${
          result.access_token
        }`;
        SheetApi.post(
          `/${
            this.state.sheetId
          }/values/${range}:append?valueInputOption=USER_ENTERED`,
          dataToInsert
        )
          .then(resp => {
            console.log(resp);
          })
          .catch(e => {
            console.log(e.response);
          });
        // }
      }.bind(this)
    );
    /*eslint-enable no-undef*/
  };

  handleApproveButton = () => {
    this.setState({
      isHidden: !this.state.isHidden
    });
  };

  render() {
    console.log(this.state)
    const {
      notices,
      isLoading,
      isLoggedIn,
      highlights,
      promotions,
      buttonText,
      isHidden
    } = this.state;

    // TODO: Move to a component
    const noticesMoveToComponent = notices.length
      ? notices.map(notice => {
          return (
            <Notice class={notice.class}>
              <p>
                <b>Envato Market Item Boosting:</b> {notice.message}
              </p>
            </Notice>
          );
        })
      : null;

    return (
      <div className="App">
        {/* TODO: Move to stateless functional component */}
        {noticesMoveToComponent}
        { isLoading && isLoggedIn ? (
          <img
            src={
              /*eslint-disable no-undef*/
              chrome.extension.getURL(loading)
              /*eslint-enable no-undef*/
            }
            alt="Loading"
          />
        ) : !isHidden ? (
          <React.Fragment>
            <hr className="app__separator" />
            <h4 className="app__title">Item Boosting</h4>

            <Button render={() => {
                return(
                  <button 
                    className={isLoggedIn ? 'logout' : 'login'}
                    onClick={isLoggedIn ? (e) => this.handleLogout(e, true) : this.handleLogin}> 
                    {isLoggedIn ? 'Logout' : 'Login'}
                  </button>
                )
              }} />

            {isLoggedIn ? (
              <React.Fragment>
                <Boosting 
                  handleFormData={this.handleFormData} 
                />

                <Highlights
                  isLoading={isLoading}
                  highlightsData={highlights}
                  handleFormData={this.handleFormData}
                />

                <Promotions
                  isLoading={isLoading}
                  promotionsData={promotions}
                  handleFormData={this.handleFormData}
                />
              </React.Fragment>
            ) : (
              null
            )}
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export default App;
