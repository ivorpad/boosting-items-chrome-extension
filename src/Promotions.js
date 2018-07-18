import React, { Component } from 'react';
import axios from 'axios';

class Promotions extends Component {

    state = {
      selectedCheckboxes: [],
      isLoading: false,
      checkboxesFetched: []
    }    

    componentDidMount = () => {
      // workaround to fix undefined .settings in jQuery validation  
      const script = document.createElement('script');
      script.textContent = "$('#promotions').validate()";
      (document.head || document.documentElement).appendChild(script);
      script.parentNode.removeChild(script);

      this.setState({
        isLoading: true
      })

      axios.get(`https://tfsnippets.ivorpad.com/wp-json/wp/v2/post_type_promotion`)
      .then(response => {
        
        if(response.status === 200) {
          const titles = response.data.map(({title}) => title.rendered )
          this.setState({
            checkboxesFetched: titles,
            isLoading: false
          })
        }
      })
      .catch(e => console.log(e))
    }
    
    handleCheckboxChange = (e) => {

      const { promotions } = this.form;
      const promotionsArr = [...promotions];
      const checked = promotionsArr
                        .filter(input => input.checked === true)
                        .map(input => input.value)
      
      this.props.handleFormData(checked, 'promotions')

    }

    render() {
        return (
           <React.Fragment>
           <legend>Promotions</legend>
             <form id="promotions" ref={form => this.form = form} onChange={this.handleCheckboxChange}>
              {this.state.isLoading ? 'loading...' : this.state.checkboxesFetched.map((title, index) => {
                const slug = title.toLowerCase().split(" ").join("-");
                return(
                  <div key={index}>
                    <input type="checkbox" id={slug} name="promotions" value={title} />
                    <label for={slug}>{title}</label>
                  </div>
                )
              })}
             </form>
           </React.Fragment>
        );
    }
}

export default Promotions;
