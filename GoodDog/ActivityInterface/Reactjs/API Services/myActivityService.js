import axios from "axios";
import * as global from "./serviceHelpers";

const create = payload => {
  const config = {
    method: "POST",
    url: global.API_HOST_PREFIX + "/api/activityentry/me",
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const getActive = () => {
  const config = {
    method: "GET",
    url: global.API_HOST_PREFIX + "/api/activityentry/me",
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const update = (payload, id) => {
  const config = {
    method: "PUT",
    url: global.API_HOST_PREFIX + "/api/activityentry/me/" + id,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const end = (payload, id) => {
  const config = {
    method: "PUT",
    url: global.API_HOST_PREFIX + "/api/activityentry/me/end/" + id,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const pause = (payload, id) => {
  const config = {
    method: "PUT",
    url: global.API_HOST_PREFIX + "/api/activityentry/me/pause/" + id,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

export { create, getActive, end, update, pause };
