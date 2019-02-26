import * as global from "./serviceHelpers";
import axios from "axios";
const APIkey = "AIzaSyDzdWabrdQcdh4i8pxn6iuqvIv4jY6icEU";
const geoLocationAPI =
  "https://maps.googleapis.com/maps/api/geocode/json?address=";

const create = payload => {
  const config = {
    method: "POST",
    url: global.API_HOST_PREFIX + "/api/addresses",
    data: payload,
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const getStates = () => {
  const config = {
    method: "GET",
    url: global.API_HOST_PREFIX + "/api/stateprovinces",
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const getPaged = pageObject => {
  const config = {
    method: "GET",
    url:
      global.API_HOST_PREFIX +
      "/api/addresses/" +
      pageObject.pageIndex +
      "/" +
      pageObject.pageSize,
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const getById = id => {
  const config = {
    method: "GET",
    url: global.API_HOST_PREFIX + "/api/addresses/" + id,
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const getByUserId = () => {
  const config = {
    method: "GET",
    url: global.API_HOST_PREFIX + "/api/addresses/myaddress",
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const update = (id, payload) => {
  const config = {
    method: "PUT",
    url: global.API_HOST_PREFIX + "/api/addresses/" + id,
    data: payload,
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const remove = id => {
  const config = {
    method: "DELETE",
    url: global.API_HOST_PREFIX + "/api/addresses/" + id,
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

const geoLocation = location => {
  const config = {
    method: "GET",
    url: geoLocationAPI + location + "&key=" + APIkey,
    withCredentials: false,
    crossDomain: true,
    headers: {
      "Content-Type": "application/json"
    }
  };

  return axios(config)
    .then(global.onGlobalSuccess)
    .catch(global.onGlobalError);
};

export {
  create,
  getPaged,
  getById,
  getByUserId,
  getStates,
  update,
  remove,
  geoLocation
};
