import React, { Component } from "react";
import { connect } from "react-redux";
import { actions as HighlightsActions } from "../reducers/highlights";
import styled from "styled-components";
import he from "he";

const HighlightsSection = styled.div`
  padding-top: 20px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  label {
    font-size: 14px;
  }
  select#highlights {
    width: 65%;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(187, 187, 187);
    border-image: initial;
    border-radius: 5px;
    padding: 3px;
  }
`

class Highlights extends Component {
  componentDidMount = () => {
    this.select.selectedIndex = "-1";
  };

  render() {
    return (
      <HighlightsSection>
        <label htmlFor="highlights">Highlights:</label>
        <select
          ref={select => (this.select = select)}
          name="highlights"
          id="highlights"
          class="highlights__select"
          multiple="multiple"
          onChange={e => this.props.setHighlights(e.target)}
        > 
          
          {this.props.highlights.data.map(({ title }, index) => {
            return (
              <option key={index} value={he.decode(title.rendered)}>
                {he.decode(title.rendered)}
              </option>
            );
          })}
        </select>
      </HighlightsSection>
    );
  }
}

const mapStateToProps = state => ({
  highlights: state.highlights
});

const HighlightsContainer = connect(
  mapStateToProps,
  {
    ...HighlightsActions
  }
)(Highlights);

export default HighlightsContainer;
