import React from "react";
import { Modal, ModalHeader } from "reactstrap";
import Stopwatch from "../StartActivityWorkflow/Stopwatch";
import * as myActivityService from "../../services/myActivityService";
import { compose, withProps, withStateHandlers } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
  InfoBox,
  InfoWindow
} from "react-google-maps";
import FileUploader from "../Files/FileUploader";
import * as prompts from "../NotificationMessage";
import geolib from "geolib";

class StopSubmit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photoModal: false,
      notes: "",
      photoUrl: ""
    };
    this.notesObj = { notes: "" };
  }

  handleChange(event) {
    let notes = event.target.value;
    this.notesObj = { notes };
  }

  submitNotes = () => {
    let notes = this.notesObj.notes;
    let photoURL = this.state.photoUrl;
    let payload = { notes, photoURL };
    let id = this.props.currentActivityId;
    myActivityService
      .update(payload, id)
      .then(this.submitSuccess)
      .catch(this.submitFail);
  };

  submitSuccess = () => {
    prompts.prompt({
      title: "Great Work!",
      text: "",
      icon: "success",
      buttons: false,
      dangerMode: false,
      timer: 2000
    });
    this.props.history.push("/");
  };

  submitFail = error => {
    console.log(error);
  };

  modalToggler = () => {
    this.props.modalRequester();
  };

  photoResponse = response => {
    this.setState(
      {
        photoUrl: response.items[0].path
      },
      () => console.log(this.state)
    );
  };

  getMiles = () => {
    let array = [];
    for (let i = 0; i < this.props.encodePolyline.length; i++) {
      if (i + 1 < this.props.encodePolyline.length) {
        array.push(
          geolib.getDistance(
            this.props.encodePolyline[i],
            this.props.encodePolyline[i + 1]
          )
        );
      } else {
        let sum = 0;
        for (let j = 0; j < array.length; j++) {
          let newSum = (sum += array[j]);
          return newSum * 0.000621371192;
        }
      }
    }
  };

  render() {
    const { encodePolyline } = this.props;

    let distanceTravelled = this.getMiles();
    const MapWithAMarker = compose(
      withStateHandlers(
        () => ({
          isOpen: false
        }),
        {
          onToggleOpen: ({ isOpen }) => () => ({
            isOpen: !isOpen
          })
        }
      ),
      withScriptjs,
      withGoogleMap
    )(props => (
      <GoogleMap
        defaultZoom={15}
        defaultCenter={
          encodePolyline.length === 0
            ? null
            : {
                lat: encodePolyline[0].lat,
                lng: encodePolyline[0].lng
              }
        }
      >
        <Marker
          position={{
            lat: encodePolyline[0].lat,
            lng: encodePolyline[0].lng
          }}
          onClick={props.onToggleOpen}
        >
          {props.isOpen && (
            <InfoWindow onCloseClick={props.onToggleOpen}>
              <p>Start</p>
            </InfoWindow>
          )}
        </Marker>
        <Marker
          position={{
            lat: encodePolyline[encodePolyline.length - 1].lat,
            lng: encodePolyline[encodePolyline.length - 1].lng
          }}
          onClick={props.onToggleOpen}
        >
          {props.isOpen && (
            <InfoWindow onCloseClick={props.onToggleOpen}>
              <p>{distanceTravelled + " miles"}</p>
            </InfoWindow>
          )}
        </Marker>
        <Polyline
          path={encodePolyline.length > 1 ? encodePolyline : null}
          strokeOpacity={0.02}
        />
      </GoogleMap>
    ));
    let buttonText = {
      fontSize: 28,
      letterSpacing: 2,
      fontWeight: 900
    };

    let activityCol = {
      content: "center",
      textAlign: "center",
      fontSize: 30,
      letterSpacing: 2,
      fontWeight: 900,
      color: "#6c757d"
    };

    let modalCol = {
      content: "center",
      textAlign: "center"
    };

    let titleText = {
      fontSize: 26,
      fontWeight: 900
    };

    let closeBtn = (
      <button className="close" onClick={this.modalToggler}>
        &times;
      </button>
    );

    return (
      <div className="container-fluid" style={activityCol}>
        <div>
          <span style={titleText} className="pb-3 mb-5" />
        </div>
        <div className="row mx-auto justify-content-center">
          <div className="">
            <div className="col-xl-1" style={modalCol} />
            <span className="mb-3">
              <Stopwatch {...this.props} {...this.state} />
            </span>
            <Modal
              isOpen={this.props.modal}
              toggle={this.modalToggler}
              onClosed={e => this.submitNotes(e)}
              className="modal-lg"
            >
              <div
                className="row mx-auto justify-content-center"
                style={modalCol}
              >
                <div className="col-xl-1">
                  <ModalHeader toggle={this.modalToggler} close={closeBtn}>
                    <span style={titleText}> Nice Work! </span>
                  </ModalHeader>
                  <span>
                    <MapWithAMarker
                      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDzdWabrdQcdh4i8pxn6iuqvIv4jY6icEU&v=3.exp&libraries=geometry,drawing,places"
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ height: `400px` }} />}
                      mapElement={<div style={{ height: `100%` }} />}
                    />
                  </span>
                  <span>
                    Leave some notes about your walk and upload a photo if you
                    like!
                  </span>

                  <FileUploader responseHendler={this.photoResponse} />

                  <div className="submission pt-4">
                    <form onSubmit={this.handleSubmit}>
                      <label>
                        <textarea
                          rows="4"
                          cols="50"
                          //value={this.state.notes}
                          onChange={e => this.handleChange(e)}
                          placeholder="Tell us about your walk (optional)"
                        />
                      </label>
                    </form>
                    <div className="flex-row justify-content-center align-items-baseline">
                      <div className="col-xl-1" style={activityCol}>
                        <button
                          className="btn btn-outline-success btn-sm mb-3"
                          style={buttonText}
                          onClick={this.submitNotes}
                        >
                          <span>
                            <i className="fa-1x fas fa-paw" />
                          </span>
                          <span> </span>
                          <span>All done</span>
                          <span />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default StopSubmit;
