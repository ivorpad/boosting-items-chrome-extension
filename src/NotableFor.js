import React, { Component } from 'react';

const styles = { paddingTop: 20 }

class NotableFor extends Component {
    render() {
        return (
         <div className="boosting_multiselect inputs" style={styles}>
          <label htmlFor="notable_for">Notable For:</label>
            <select name="notable_for" id="notable_for" class="notable_for" multiple="multiple">
              <option value="camera">Camera Work</option>
              <option value="camera">Camera Work</option>
              <option value="camera">Camera Work</option>
              <option value="camera">Camera Work</option>
              <option value="camera">Camera Work</option>
              <option value="camera">Camera Work</option>
            </select>
         </div>
        );
    }
}

export default NotableFor;
