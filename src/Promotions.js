import React, { Component } from 'react';

class Promotions extends Component {

    state = { selectedCheckboxes: [] }    

    componentDidMount = () => {
      // workaround to fix undefined .settings in jQuery validation  
      const script = document.createElement('script');
      script.textContent = "$('#promotions').validate()";
      (document.head || document.documentElement).appendChild(script);
      script.parentNode.removeChild(script);
    }
    
    handleCheckboxChange = (e) => {
      const { promotionsForm } = this.form;
      const promotionsArr = [...promotionsForm];
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
              {this.props.isLoading ? 'loading...' : this.props.promotionsData.map(({title}, index) => {
      
                const slug = title.rendered.toLowerCase().split(" ").join("-");
                
                return(
                  <div key={index}>
                    <input type="checkbox" id={slug} name="promotions" value={title.rendered} />
                    <label for={slug}>{title.rendered}</label>
                  </div>
                )
              })}
             </form>
           </React.Fragment>
        );
    }
}

export default Promotions;
