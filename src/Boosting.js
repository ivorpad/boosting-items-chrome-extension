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

function log(value) {
  console.log(value); //eslint-disable-line
}

class Boosting extends Component {

    render() {
        return (
          <div>
              <h3 style={ {paddingBottom: 5, textAlign:'left', fontWeight: 'bold', fontSize: 16} }>Boosting</h3>
              <div style={style}>
                <Slider min={0} max={3} marks={marks} step={null} onChange={log} defaultValue={0} />
              </div>
            </div>
        );
    }
}

export default Boosting;
