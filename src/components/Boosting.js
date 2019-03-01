import "rc-slider/assets/index.css";
import React, { Component } from "react";
import Slider from "rc-slider";
import { connect } from "react-redux";
import { actions as boostingActions } from "../reducers/boosting";
import { extractDomainName } from "../helpers/helpers";

const style = {
  marginTop: 10,
  marginBottom: 50,
  marginLeft: 20,
  marginRight: 20
};

const domain = extractDomainName(window.location.hostname);

let marks;

if (domain !== "audiojungle") {
  marks = {
    0: <strong>No rating</strong>,
    1: <strong>Good</strong>,
    2: <strong>Great</strong>,
    3: <strong>Exceptional</strong>,
    4: <strong>WOW!</strong>
  };
} else {
  marks = {
    0: <strong>No rating</strong>,
    1: <strong>Good</strong>,
    2: <strong>WOW!</strong>
  };
}

class Boosting extends Component {
  handleItemRating = rating => this.props.setBoosting(rating);

  render() {
    return (
      <div className="boosting">
        <div className="boosting__slider">
          <div style={style}>
            <Slider
              min={0}
              max={domain !== "audiojungle" ? 4 : 2}
              marks={marks}
              step={null}
              onChange={this.handleItemRating}
              defaultValue={0}
            />
          </div>
        </div>
      </div>
    );
  }
}

const BoostingContainer = connect(
  null,
  { ...boostingActions }
)(Boosting);

export default BoostingContainer;
