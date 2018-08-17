import React, { Component } from 'react';

class Promotions extends Component {

    state = { selectedCheckboxes: [] }    

    shouldComponentUpdate = (nextProps, nextState) => {
      if (this.state.selectedCheckboxes !== nextState.selectedCheckboxes) {
        return true;
      }
      return false;
    }

    componentDidMount = () => {
      // workaround to fix undefined .settings in jQuery validation
      const script = document.createElement("script");
      script.textContent = "$('#promotions').validate()";
      (document.head || document.documentElement).appendChild(script);
      script.parentNode.removeChild(script);
    }
    
    handleCheckboxChange = (e) => {
      const { promotions: promotionsForm } = this.form;
      const promotionsArr = [...promotionsForm];
      const checked = promotionsArr
                        .filter(input => input.checked === true)
                        .map(input => input.value);

      this.setState({selectedCheckboxes: checked});                  
    }   
    
    componentDidUpdate = (prevProps, prevState) => {
      if (this.state.selectedCheckboxes !== prevState.selectedCheckboxes ) {
        this.props.handleFormData(this.state.selectedCheckboxes, "promotions");
      }
    }
    
    render() {
        return (
           <div className="promotions">
            <div className="promotions__form">
              <legend className="promotions__legend">Promotions</legend>
              <form ref={form => this.form = form} id="promotions" onChange={this.handleCheckboxChange}>
                {this.props.render()}
              </form>
             </div>
           </div>
        );
    }
}

export default Promotions;
