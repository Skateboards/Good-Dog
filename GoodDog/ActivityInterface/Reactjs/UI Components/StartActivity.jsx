import React from "react";
import * as activityService from "../../services/activityService";
import ActivityCard from "../StartActivityWorkflow/ActivityCard";
import StartActivityMyPets from "../StartActivityWorkflow/StartActivityMyPets";
import StopSubmit from "./StopSubmit";

class StartActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityTypes: [],
      icons: {
        0: "",
        1: "far fa-clock",
        2: "fas fa-map-marker-alt"
      }
    };
  }

  componentDidMount() {
    activityService
      .getAllActivityTypes()
      .then(this.onGetActivityTypeSuccess)
      .catch(this.onError);
  }

  onGetActivityTypeSuccess = (response, i) => {
    let dict = [];
    for (i = 0; i < response.items.length; i++) {
      let currentType = response.items[i];
      dict[currentType.id] = currentType;
    }
    this.setState({
      activityTypes: dict
    });
    console.log(this);
  };

  startActivity = selected => {
    this.props.activityRequester(selected);
  };

  activityList = activity => {
    return (
      <ActivityCard
        key={activity.id}
        activity={activity}
        icon={this.state.icons[activity.id]}
        activityRequester={this.startActivity}
      />
    );
  };

  render() {
    if (this.props.activityTypeId === null) {
      return (
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col">
              <span>{this.state.activityTypes.map(this.activityList)}</span>
            </div>
          </div>
        </div>
      );
    } else if (
      this.props.activityTypeId !== null &&
      this.props.myDog !== null
    ) {
      return <StopSubmit {...this.props} />;
    } else {
      return <StartActivityMyPets />;
    }
  }
}

export default StartActivity;
