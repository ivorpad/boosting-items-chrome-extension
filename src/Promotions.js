import React, { Component } from 'react';

class Promotions extends Component {
    render() {
        return (
           <div className="boosting_multicheckbox">
           <legend>Promotions</legend>
             <div className="form-controls">
               <div>
                 <input type="checkbox" id="scales" name="feature" value="scales" checked />
                 <label for="scales">Stunning Drone Imagery</label>
               </div>

               <div>
                 <input type="checkbox" id="horns" name="feature" value="horns" />
                 <label for="horns">The Great Outdoors</label>
              </div>

              <div>
                <input type="checkbox" id="claws" name="feature" value="claws" />
                <label for="claws"> Documentary B-Stock</label>
              </div>
             </div>
           </div> 
        );
    }
}

export default Promotions;
