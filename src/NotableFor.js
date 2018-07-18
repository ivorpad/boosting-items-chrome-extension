import React, { Component } from 'react';
import axios from 'axios';

const styles = { paddingTop: 20 }

class NotableFor extends Component {

    state = {
      selectedOptions: [],
      optionsFetched: [],
      isLoading: false
    }

    componentDidMount = () => {

      this.setState({
        isLoading: true
      })

      axios.get(`https://tfsnippets.ivorpad.com/wp-json/wp/v2/post_type_highlight`)
        .then(response => {
          
          if(response.status === 200) {
            const titles = response.data.map(({title}) => title.rendered )
            this.setState({
              optionsFetched: titles,
              isLoading: false
            })
          }
        })
        .catch(e => console.log(e))
    }
    

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
              {this.state.isLoading ? <option disabled="disabled">loading data...</option> : this.state.optionsFetched.map((title, index) => {
                return(
                  <option key={index} value={title}>{title}</option>
                )
              })}
            </select>
         </div>
        );
    }
}

export default NotableFor;
