import React, { Component } from "react";
import { connect } from "react-redux";
import { actions as PromotionActions } from "./reducers/promotions";

class Promotions extends Component {
  componentDidMount = () => {
    //workaround to fix undefined.settings in jQuery validation
    const script = document.createElement("script");
    script.textContent = "$('#promotions').validate()";
    (document.head || document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
  };

  render() {
    return (
      <div className="promotions">
        <div className="promotions__form">
          <legend className="promotions__legend">Promotions</legend>
          <form
            id="promotions"
            onChange={e => this.props.addPromotions(e.target)}
          >
            {this.props.promotions.isFetching ? (
              <p>loading...</p>
            ) : (
              this.props.promotions.data &&
              this.props.promotions.data.map(({ title }, index) => {
                const slug = title.rendered
                  .toLowerCase()
                  .split(" ")
                  .join("-");

                return (
                  <div key={index}>
                    <input
                      type="checkbox"
                      id={slug}
                      name="promotions"
                      value={title.rendered}
                    />
                    <label for={slug}>{title.rendered}</label>
                  </div>
                );
              })
            )}
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  promotions: state.promotions
});

const PromotionsContainer = connect(
  mapStateToProps,
  { ...PromotionActions }
)(Promotions);

export default PromotionsContainer;
