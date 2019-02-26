import React from "react";
import StartActivity from "./StartActivity";
import * as myActivityService from "../../services/myActivityService";
import PageLoader from "../Common/PageLoader";
import * as petService from "../../services/petServices";
import StopSubmit from "../StartActivityWorkflow/StopSubmit";
import { Card, CardDeck } from "reactstrap";
import "../../styles/countdownclock.css";
import geolib from "geolib";
import WeatherInfo from "./WeatherInfo";

class MyActivities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityTypeId: null,
      isActive: null,
      Notes: null,
      primaryPhotoUrl: null,
      continueLast: false,
      currentActivityId: null,
      myDog: null,
      coordinates: [],
      modal: false,
      pointsEarned: 0,
      timeElapsed: null,
      encodePolyline: [],
      distanceTravelled: null
    };
  }

  componentDidMount() {
    // myActivityService
    //   .getActive()
    //   .then(this.onGetActiveSuccess)
    //   .catch(this.onError);

    petService
      .myPets()
      .then(this.onMyPetSuccess)
      .catch(this.onMyPetFail);
  }

  componentDidUpdate(prevState, prevProps) {
    if (prevState.pointsEarned !== this.state.pointsEarned) {
      let pointsArray = [prevProps.pointsEarned, this.state.pointsEarned];
    }
  }

  onGetActiveSuccess = response => {
    if (response.items == null) {
      this.setState(
        {
          isActive: false,
          continueLast: false
        },
        console.log(this.state)
      );
    } else {
      this.setState(
        {
          isActive: true,
          currentActivityId: response.items[0].id,
          pointsEarned: response.items[0].pointsEarned,
          timeElapsed: response.items[0].timeElapsed
        },
        console.log(this.state)
      );
    }
  };

  onError = error => {
    console.log(error);
  };

  onMyPetSuccess = response => {
    if (response.items === null) {
      let myDog = [
        {
          id: 83,
          name: "My Dog",
          primaryPhotoUrl:
            "https://png.pngtree.com/svg/20140418/footprint_516678.png"
        }
      ];
      this.setState({
        myDog: myDog
      });
    } else {
      let myDog = response.items;
      this.setState({
        myDog: myDog
      });
    }
  };

  onMyPetFail = error => {
    console.log(error);
  };

  onActivityRequested = activity => {
    this.setState(
      {
        activityTypeId: activity.id,
        isActive: true,
        continueLast: false
      },
      console.log(this.state)
    );
  };

  cancelLast = () => {
    this.setState({
      isActive: false,
      continueLast: false
    });
    let id = this.state.currentActivityId;
    let payload = {
      isActive: false,
      pointsEarned: this.state.pointsEarned,
      timeElapsed: this.state.timeElapsed
    };
    myActivityService
      .end(payload, id)
      .then(this.onCancelSuccess)
      .catch(this.onError);
  };

  onCancelSuccess = response => {
    console.log(response);
    this.setState({
      isActive: false,
      continueLast: false,
      currentActivityId: null,
      timeElapsed: 0,
      pointsEarned: 0
    });
  };

  continueLast = () => {
    this.setState({
      continueLast: true
    });
  };

  goBack = () => {
    this.props.history.push("/");
  };

  activitiesHome = () => {
    this.props.history.push("/activities/me");
  };

  currentActivityRequested = () => {
    let activityTypeId = this.state.activityTypeId;
    let petId = this.state.myDog[0].id;
    let isActive = this.state.isActive;
    let payload = { petId, isActive, activityTypeId };
    myActivityService
      .create(payload)
      .then(this.currentActivityRequestedSuccess)
      .catch(this.currentActivityRequestedFail);
  };

  currentActivityRequestedSuccess = response => {
    console.log(response);
    let currentActivityId = response.item;
    this.setState(
      {
        currentActivityId: currentActivityId
      },
      () => {
        console.log(this.state);
      }
    );
  };

  currentActivityRequestedFail = error => {
    console.log(error);
  };

  endCurrentActivityRequested = activityInfo => {
    let distanceTravelled = this.getMiles();
    console.log(distanceTravelled);
    console.log("activityInfo", activityInfo);
    console.log(this.state.encodePolyline);
    let id = this.state.currentActivityId;
    let payload = {
      isActive: false,
      pointsEarned: activityInfo.points,
      timeElapsed: activityInfo.seconds,
      distanceTravelled: distanceTravelled
    };

    myActivityService
      .end(payload, id)
      .then(this.endSuccess)
      .catch(this.endFail);
  };

  endSuccess = response => {
    console.log(response);
    this.toggleModal();
  };

  endFail = error => {
    console.log(error);
  };

  coordEndRequester = activityInfo => {
    this.setState({ encodePolyline: activityInfo.coords }, () =>
      this.endCurrentActivityRequested(activityInfo)
    );
  };

  getMiles = () => {
    let array = [];
    for (let i = 0; i < this.state.encodePolyline.length; i++) {
      if (i + 1 < this.state.encodePolyline.length) {
        array.push(
          geolib.getDistance(
            this.state.encodePolyline[i],
            this.state.encodePolyline[i + 1]
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

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  mapMyDogs = () => {
    return this.state.myDog.map((dog, i) => (
      <span key={i} className="myDogIcon ml-2 mr-2">
        <img
          src={dog.primaryPhotoUrl}
          alt="cute dog"
          className="img-thumbnail circle img-fluid thumb48"
        />
        <p>{dog.name}</p>
      </span>
    ));
  };

  pointCountRequested = points => {
    let pointsEarned = points;
    this.setState({
      pointsEarned: pointsEarned
    });
  };

  render() {
    let titleText = {
      fontSize: 26,
      fontWeight: 900
    };

    let goBackText = { color: "#007bff", display: "inline" };

    if (this.state.isActive === null && this.state.continueLast === null) {
      return <PageLoader />;
    }
    if (this.state.isActive === true && this.state.continueLast === null) {
      return (
        <div className="container-fluid">
          <div className="row align-content-center">
            <div className="col mt-3">
              <span style={titleText} className="pb-3 mb-3">
                {" "}
                My Walks
              </span>
              <div className="mt-2">
                <p
                  style={{
                    fontSize: 20
                  }}
                >
                  Continue last walk?
                </p>
                <CardDeck>
                  <Card
                    className=""
                    onClick={e => this.continueLast(e)}
                    style={{
                      backgroundColor: "#37bc9b",
                      borderColor: "#37bc9b",
                      color: "#FFF",
                      textAlign: "center"
                    }}
                  >
                    <i className="fa-3x fas fa-dog mt-4" />
                    <span
                      style={{
                        fontSize: 48
                      }}
                    >
                      Yes
                    </span>
                  </Card>
                  <Card
                    onClick={e => this.cancelLast(e)}
                    style={{
                      backgroundColor: "#f05050",
                      borderColor: "#f05050",
                      color: "#FFF",
                      textAlign: "center",

                      fontFamily: "monospace",
                      height: 100 + "%"
                    }}
                  >
                    <i className="fa-3x fas fa-paw mt-4" />
                    <span
                      style={{
                        fontSize: 48
                      }}
                    >
                      No
                    </span>
                  </Card>
                </CardDeck>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (
      (this.state.isActive === true && this.state.continueLast === true) ||
      (this.state.isActive === true && this.state.continueLast === false)
    ) {
      return (
        <div className="container-fluid">
          <div className="row align-content-center">
            <div className="col-lg-8 col-xl-8 mt-3">
              <p className="" onClick={this.goBack} style={goBackText}>
                <i className="fas fa-angle-left" /> Dashboard
              </p>
              <p style={titleText} className="pb-3">
                {" "}
                My Walk
                <span className="float-right">
                  <p>
                    <i className="fas fa-coins" />{" "}
                    <span>{this.state.pointsEarned}</span>
                  </p>
                </span>
              </p>
              <div className="dogContainer">{this.mapMyDogs()}</div>
              <div className="mb-3">
                <StopSubmit
                  {...this.props}
                  {...this.state}
                  currentActivityRequester={this.currentActivityRequested}
                  endActivityRequester={this.endCurrentActivityRequested}
                  routeEndRequester={this.coordEndRequester}
                  modalRequester={this.toggleModal}
                  pointRequester={this.pointCountRequested}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="container-fluid">
        <div className="row align-content-center justify-content-center mt-2">
          <div className="col-lg-8 col-xl-6 mt-3">
            <div className="d-flex">
              <p className="d-inline" onClick={this.goBack} style={goBackText}>
                <i className="fas fa-angle-left" /> Dashboard
              </p>
              <WeatherInfo />
            </div>
            <span style={titleText} className="pb-3">
              {" "}
              Start new
            </span>
            <div>
              <StartActivity
                {...this.props}
                {...this.state}
                activityRequester={this.onActivityRequested}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyActivities;
