import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions as HighlightsActions } from './reducers/highlights'
import { actions as restApiDataSagaActions } from "./sagas/restApiDataSaga";

class Highlights extends Component {

    
    // handleOptionChange = (e) => {
    //   const selected = [...e.target.selectedOptions];
    //   this.setState({
    //     selectedOptions: selected.map((val) => val.innerText)
    //   });
    // }

    componentDidMount = () => {
      this.select.selectedIndex = "-1"
    }
    
    
    render() {
      console.log(this.props)
        return <div className="highlights" style={{ paddingTop: 20, fontWeight: "bold" }}>
            <label htmlFor="highlights">Highlights:</label>
            <select 
              ref={select => (this.select = select)} 
              name="highlights" id="highlights" 
              class="highlights__select" 
              multiple="multiple" 
              onChange={e => this.props.setHighlights(e.target)}
            >
              {this.props.highlights.data.map(({ title }, index) => {
                return <option key={index} value={title.rendered}>
                    {title.rendered}
                  </option>;
              })}
            </select>
          </div>;  
    }
}

const mapStateToProps = (state) => ({
  highlights: state.highlights
})

const HighlightsContainer = connect(
  mapStateToProps,
  {
    ...HighlightsActions
  }
)(Highlights);

export default HighlightsContainer;
