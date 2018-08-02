import 'rc-slider/assets/index.css';
import React, { Component } from 'react';
import Slider from 'rc-slider';
const style = { marginTop: 10, marginBottom: 50, marginLeft: 20, marginRight: 20 };

const marks = {
  0: <strong>Good</strong>,
  1: <strong>Great</strong>,
  2: <strong>Exceptional</strong>,
  3: <strong>WOW!</strong>,
};

class Boosting extends Component {

    itemBoostingChange = (rating) => {
      switch(rating) {
        case 1:
          return 'Great';
        case 2:
          return 'Exceptional';
        case 3:
          return 'WOW!'
        default:
          return 'Good';
      }
    }

    handleItemRating = (rating) => {
      this.props.handleFormData(this.itemBoostingChange(rating), 'boosting')
    }

    render() {
        return (
          <div className="boosting">
            <div className="boosting__slider">
              <h3 style={ {paddingBottom: 5, textAlign:'left', fontWeight: 'bold', fontSize: 16} }>Boosting</h3>
              <div style={style}>
                <Slider min={0} max={3} marks={marks} step={null} onChange={this.handleItemRating} defaultValue={0} />
              </div>
            </div>
          </div>
        );
    }
}

export default Boosting;
