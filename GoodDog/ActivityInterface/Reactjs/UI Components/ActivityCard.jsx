import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

class ActivityCard extends React.Component {
  onActivityRequested = () => {
    this.props.activityRequester(this.props.activity);
  };

  render() {
    return (
      <div onClick={this.onActivityRequested}>
        <Card className={"mt-3 mb-3"}>
          <CardBody
            className="m-0"
            style={{
              backgroundColor: "#37bc9b",
              borderColor: "#37bc9b",
              color: "#FFF",
              textAlign: "center",
              fontSize: 26
            }}
          >
            <CardTitle>
              <div className={"pt-3 fa-4x " + this.props.icon} />
            </CardTitle>
            <div>{this.props.activity.title}</div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default ActivityCard;
