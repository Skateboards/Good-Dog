import React from "react";
import * as weatherServices from "../../services/weatherServices";
import weatherIcons from "../uiHelpers/WeatherIcons";
const queryString = require("query-string");

class WeatherInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentIcon: "fa-4x",
      currentTemperature: 30,
      currentSummary: "Clear"
    };
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.getWeather);
  }

  getWeather = response => {
    const coords = {
      lat: response.coords.latitude,
      long: response.coords.longitude,
      time: new Date().getTime()
    };
    const queryParams = queryString.stringify(coords);
    weatherServices
      .getCurrent(queryParams)
      .then(this.getCurrentOnSuccess)
      .then(this.getWeatherOnSuccess);
  };

  getWeatherOnSuccess = ({ item }) => {
    this.setState({
      currentIcon: item[0].icon,
      currentTemperature: Math.floor(item[0].temperature),
      currentSummary: item[0].summary
    });
  };
  render() {
    return (
      <span className="row row-flush ml-auto">
        <div className="d-flex align-items-center justify-content-center d-inline">
          <span style={{ color: "#007bff" }}>
            <em className={`${weatherIcons[this.state.currentIcon]} fa-2x`} />
          </span>
        </div>
        <div className="d-flex align-items-center justify-content-center d-inline">
          <div>
            <div className="h3 ml-2 text-bold d-inline">
              {this.state.currentTemperature}&deg;
            </div>
          </div>
        </div>
      </span>
    );
  }
}
export default WeatherInfo;
