import axios from "axios";
import * as global from "./serviceHelpers";

const charge = token => {
  const config = {
    method: "POST",
    url: global.API_HOST_PREFIX + "/api/stripe",
    data: token,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  debugger;
  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const create = payload => {
  const config = {
    method: "POST",
    url: global.API_HOST_PREFIX + "/api/activityentries",
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const update = (id, payload) => {
  const config = {
    method: "PUT",
    url: global.API_HOST_PREFIX + "/api/activityentries/" + id,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const getAll = () => {
  const config = {
    method: "GET",
    url: global.API_HOST_PREFIX + "/api/activities",
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "/application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const getPage = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      global.API_HOST_PREFIX +
      "/api/activityentries/necessity/" +
      pageIndex +
      "/" +
      pageSize,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "/application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const deleteById = id => {
  const config = {
    method: "DELETE",
    url: global.API_HOST_PREFIX + "/api/activityentries/" + id,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const getAllActivityTypes = () => {
  const config = {
    method: "GET",
    url: global.API_HOST_PREFIX + "/api/activities",
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "/application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const getActivityDataRange = data => {
  const config = {
    method: "GET",
    url:
      global.API_HOST_PREFIX +
      "/api/activityentries?" +
      global.qs.stringify(data),
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

export {
  charge,
  create,
  update,
  deleteById,
  getPage,
  getAll,
  getAllActivityTypes,
  getActivityDataRange
};
