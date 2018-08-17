import React, { Component } from 'react';

class Highlights extends Component {

    state = { selectedOptions: [] }
    
    shouldComponentUpdate = (nextProps, nextState) => {
      if (this.state.selectedOptions !== nextState.selectedOptions) {
        return true;
      }
      return false;
    }
    
    handleOptionChange = (e) => {
      const selected = [...e.target.selectedOptions];
      this.setState({
        selectedOptions: selected.map((val) => val.innerText)
      });
    }

    componentDidUpdate = (prevProps, prevState) => {
      if(this.state.selectedOptions !== prevState.selectedOptions) {
        this.props.handleFormData(this.state.selectedOptions, "highlights");
      }
    }
    
    render() {
        return (
          <div className="highlights" style={{ paddingTop: 20, fontWeight: 'bold' }}><label htmlFor="highlights">Highlights:</label>
            <select name="highlights" id="highlights" class="highlights__select" multiple="multiple" onChange={this.handleOptionChange}>
              {this.props.highlightsData.map(({ title }, index) => {
                return(
                  <option key={index} value={title.rendered}>{title.rendered}</option>
                )
              })}
            </select>
         </div>
        );
    }
}

export default Highlights;
