import React, { Component } from 'react';
import axios from 'axios';

const styles = { paddingTop: 20 }

class NotableFor extends Component {

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
         <div className="boosting_multiselect inputs" style={styles}><label htmlFor="notable_for">Notable For:</label>
            <select name="notable_for" id="notable_for" class="notable_for" multiple="multiple" onChange={this.handleOptionChange}>
              {this.props.isLoading ? <option disabled="disabled">loading data...</option> : this.props.highlightsData.map(({title}, index) => {
                return(
                  <option key={index} value={title.rendered}>{title.rendered}</option>
                )
              })}
            </select>
         </div>
        );
    }
}

export default NotableFor;
