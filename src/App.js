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
    itemUrl: "",
    itemName: "",
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

    this.setState({
      isLoading: true,
      reviewerName: name,
      itemName,
      itemUrl
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
            const message = `Please make sure the WordPress Site URL option is correct. Go to the Extension Options Panel.`;
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
        this.setState({
          sheetId: value.sheetIdValue
        });
      }.bind(this)
    );
    /* eslint-enable no-undef */
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
    exitButton.addEventListener("click", this.handleLogout);

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

  handleLogout = e => {
    e.preventDefault();
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

    const { itemUrl, itemName, reviewerName, formData } = this.state;

    const dataToInsert = {
      range: range,
      majorDimension: "ROWS",
      values: [
        [
          moment(Date.now()).format("MM-DD-YYYY"),
          itemUrl,
          itemName,
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
    const notices = this.state.notices.length
      ? this.state.notices.map(notice => {
          return (
            <Notice class={notice.class}>
              <p>
                <b>Envato Market Item Boosting:</b> {notice.message}
              </p>
            </Notice>
          );
        })
      : null;

    return !this.state.isHidden ? (
      <div className="App">
        {notices}
        {this.state.isLoading ? (
          <img
            src={
              /*eslint-disable no-undef*/
              chrome.extension.getURL(loading)
              /*eslint-enable no-undef*/
            }
            alt="Loading"
          />
        ) : (
          <React.Fragment>
            <hr className="app__separator" />
            <h4 className="app__title">Item Boosting</h4>

            {this.state.isLoggedIn ? (
              <React.Fragment>
                <Button
                  value={this.state.buttonText}
                  isLoggedIn={this.state.isLoggedIn}
                  handleLogout={this.handleLogout}
                />

                <Boosting handleFormData={this.handleFormData} />

                <Highlights
                  isLoading={this.state.isLoading}
                  highlightsData={this.state.highlights}
                  handleFormData={this.handleFormData}
                />

                <Promotions
                  isLoading={this.state.isLoading}
                  promotionsData={this.state.promotions}
                  handleFormData={this.handleFormData}
                />
              </React.Fragment>
            ) : (
              <Button
                value={this.state.buttonText}
                isLoggedIn={this.state.isLoggedIn}
                handleLogin={this.handleLogin}
              />
            )}
          </React.Fragment>
        )}
      </div>
    ) : null;
  }
}

export default App;
