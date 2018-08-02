import React, { Component } from 'react';

class Highlights extends Component {

    state = { selectedOptions: [] }    

    handleOptionChange = (e) => {
      const selected = [...e.target.selectedOptions];
      let options = [];

      selected.forEach((val) => {
        options.push(val.innerText)
      });
      this.props.handleFormData(options, 'notable_for')
    }

    render() {

        return (
         <div className="highlights" style={{ paddingTop: 20 }}><label htmlFor="notable_for">Highlights:</label>
            <select name="notable_for" id="notable_for" class="highlights__select" multiple="multiple" onChange={this.handleOptionChange}>
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
