import React from "react";
import * as addressService from "../../services/addressService";
import { Card, CardBody } from "reactstrap";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

class MiniCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      addressData: {},
      stateProvince: {},
      mapImageURL: "",
      location: {
        lat: 0,
        lng: 0
      }
    };
  }

  componentDidMount() {
    if (this.props.match.params.id > 0) {
      let currentId = this.props.match.params.id;
      addressService
        .getById(currentId)
        .then(this.onGetIdSuccess)
        .catch(this.onGetIdError);
    } else {
      let currentId = this.props.id;
      addressService
        .getById(currentId)
        .then(this.onGetIdSuccess)
        .catch(this.onGetIdError);
    }
    window.scrollTo(0, 0);
  }

  onGetIdSuccess = response => {
    this.setState({
      addressData: response.item,
      stateProvince: response.item.stateProvince
    });
    this.setMapData();
    addressService
      .geoLocation(this.state.mapImage)
      .then(this.onGeoLocationSuccess)
      .catch(this.onGeoLocationFail);
  };

  setMapData = () => {
    let mapImageURL = encodeURIComponent(
      this.state.addressData.lineOne.replace(/[&\\#,+()$~%.'":*?<>{}]/g, "") +
        "," +
        this.state.addressData.city.replace(/[&\\#,+()$~%.'":*?<>{}]/g, "") +
        "," +
        this.state.stateProvince.code.replace(/[&\\#,+()$~%.'":*?<>{}]/g, "") +
        "," +
        this.state.addressData.postalCode.replace(
          /[&\\#,+()$~%.'":*?<>{}]/g,
          ""
        )
    );
    this.setState({ mapImage: mapImageURL });
  };

  onGetIdError = error => {
    console.log(error);
  };

  onGeoLocationSuccess = response => {
    console.log(response);
    let lat = parseFloat(response.results[0].geometry.location.lat);
    let lng = parseFloat(response.results[0].geometry.location.lng);
    this.setState({
      location: {
        lat: lat,
        lng: lng
      }
    });
  };

  onGeoLocationFail = error => {
    console.log(error);
  };

  onEditRequest = () => {
    this.props.editRequester(this.props);
  };

  onDeleteRequest = () => {
    this.props.deleteRequester(this.props);
  };

  render() {
    const requiredProps = {
      googleMapURL:
        "//maps.google.com/maps/api/js?key=AIzaSyDzdWabrdQcdh4i8pxn6iuqvIv4jY6icEU",
      loadingElement: <div className="gmap">Loading...</div>,
      containerElement: <div className="gmap" />,
      mapElement: <div style={{ height: `100%` }} />
    };

    const DemoMapCustomStyle = compose(
      withProps(requiredProps),
      withScriptjs,
      withGoogleMap
    )(props => (
      <GoogleMap
        defaultZoom={15}
        defaultCenter={this.state.location}
        defaultOptions={{ styles: props.mapStyles }}
      >
        <Marker position={props.location} />
      </GoogleMap>
    ));

    return (
      <Card className="card-default bg-transparent border border-info mb-0">
        <DemoMapCustomStyle location={this.state.location} />
        <CardBody
          className="text-left bg-info border border-0 border-info"
          border="none"
        >
          <div className="ml-auto">
            <span>
              <button
                className="btn float-right btn-info btn-xs"
                display="none"
                onClick={this.onEditRequest}
              >
                <i className="fas fa-pencil-alt" />
              </button>
            </span>
            <span>
              <button
                className="button btn float-right btn-info btn-xs hidden"
                onClick={this.onDeleteRequest}
              >
                <i className="far fa-trash-alt" />
              </button>
            </span>
            <div className="d-flex">
              <em className="fas fa-map-marker-alt fa-2x mr-3" />
              <div>
                <span>{this.state.addressData.lineOne}</span>
                <div>{this.state.addressData.lineTwo}</div>
                <span>
                  {this.state.addressData.city}
                  {", "}
                </span>
                <span>{this.state.stateProvince.code} </span>
                <span>{this.state.addressData.postalCode}</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default MiniCard;
