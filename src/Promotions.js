import React, { Component } from 'react';

class Promotions extends Component {

    state = { selectedCheckboxes: [] }    

    shouldComponentUpdate = (nextProps, nextState) => {
      console.log('this.state', this.state);
      console.log('this.props', this.props);
      console.log("============================================================");
      console.log('​nextState', nextState);
      console.log('​Promotions -> shouldComponentUpdate -> nextProps', nextProps);
    }
    
    
    handleCheckboxChange = (e) => {
      const { promotions: promotionsForm } = this.form;
      const promotionsArr = [...promotionsForm];
      const checked = promotionsArr
                        .filter(input => input.checked === true)
                        .map(input => input.value)
      
      this.props.handleFormData(checked, 'promotions')

    }

    render() {
        return (
           <div className="promotions">
            <div className="promotions__form">
              <legend className="promotions__legend">Promotions</legend>
              <form id="promotions" ref={form => this.form = form} onChange={this.handleCheckboxChange}>
                {this.props.promotionsData.map(({title}, index) => {
        
                  const slug = title.rendered.toLowerCase().split(" ").join("-");
                  
                  return(
                    <div key={index}>
                      <input type="checkbox" id={slug} name="promotions" value={title.rendered} />
                      <label for={slug}>{title.rendered}</label>
                    </div>
                  )
                })}
              </form>
             </div>
           </div>
        );
    }
}

export default Promotions;
