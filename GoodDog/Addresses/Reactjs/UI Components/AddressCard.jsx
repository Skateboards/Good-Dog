import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";

class AddressCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      hidden: true,
      mapImage: ""
    };
  }

  componentDidMount = () => {
    let mapImageURL = encodeURIComponent(
      this.props.address.lineOne.replace(/[&\\#,+()$~%.'":*?<>{}]/g, "") +
        this.props.address.city.replace(/[&\\#,+()$~%.'":*?<>{}]/g, "") +
        this.props.address.stateProvince.code.replace(
          /[&\\#,+()$~%.'":*?<>{}]/g,
          ""
        )
    );
    this.setState({ mapImage: mapImageURL });
    window.scrollTo(0, 0);
  };

  onOpenModal = () => {
    this.props.modalRequester(this.props.address);
  };

  onEditRequest = () => {
    this.props.editRequester(this.props.address);
  };

  hoverOn = () => {
    if (this.state.hover === false && this.state.hidden === true) {
      this.setState({
        hover: true,
        hidden: false
      });
    }
  };

  hoverOff = () => {
    if (this.state.hover === true && this.state.hidden === false) {
      this.setState({
        hover: false,
        hidden: true
      });
    }
  };

  render() {
    return (
      <div className="col-xl-4 col-md-6 card-container">
        <Card
          className="card bg-transparent border border-info m-2"
          onMouseOver={e => this.hoverOn(e)}
          onMouseOut={e => this.hoverOff(e)}
        >
          <CardHeader>
            <div onClick={e => this.onOpenModal(e)}>
              <img
                className="card-img-top"
                alt="Map"
                height="flex"
                width="flex"
                src={
                  "//maps.googleapis.com/maps/api/staticmap?center=" +
                  `${this.state.mapImage}` +
                  "&zoom=14&size=640x640&maptype=roadmap&markers=color:red&key=AIzaSyDzdWabrdQcdh4i8pxn6iuqvIv4jY6icEU"
                }
              />
            </div>
          </CardHeader>
          <CardBody
            className="text-left bg-info border border-0 border-info"
            border="none"
            onClick={e => this.onOpenModal(e)}
          >
            <span>
              <button
                type="button"
                className="button btn float-right btn-xs btn-info"
                onClick={this.onEditRequest}
                hidden={this.state.hidden}
              >
                <i className="fas fa-pen" />
              </button>
            </span>
            <span />
            <div className="d-flex">
              <em className="fas fa-map-marker-alt fa-2x mr-3" />
              <div>
                <span>{this.props.address.lineOne}</span>
                <div>{this.props.address.lineTwo}</div>
                <span>
                  {this.props.address.city}
                  {", "}
                </span>
                <span>{this.props.address.stateProvince.code} </span>
                <span>{this.props.address.postalCode}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default AddressCard;
