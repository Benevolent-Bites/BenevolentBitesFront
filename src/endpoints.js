import React from "react";

export function apiUrl() {
  const env = process.env.REACT_APP_ENV;
  const dict = {
    prod: "https://api.benevolentbites.org",
    dev: "https://devapi.benevolentbites.org",
    local: "http://localhost:9000",
  };
  return dict[env.toLowerCase()];
}

export function frontUrl() {
  const env = process.env.REACT_APP_ENV;
  const dict = {
    prod: "https://app.benevolentbites.tech",
    dev: "https://dev.benevolentbites.tech",
    local: "http://localhost:3000",
  };
  return dict[env.toLowerCase()];
}

export function login(type) {
  if (type == "user") {
    return apiUrl() + "/user/signup";
  }
  if (type == "rest") {
    return apiUrl() + "/rest/signup";
  }
}

export function authVerify() {
  return apiUrl() + "/verify";
}

export function restGetInfo() {
  return apiUrl() + "/rest/getinfo";
}

export function restSetInfo() {
  return apiUrl() + "/rest/setinfo";
}

export function restSetPassword() {
  return apiUrl() + "/rest/setpassword";
}

export function userGetInfo() {
  return apiUrl() + "/user/getinfo";
}

export function userSetInfo() {
  return apiUrl() + "/user/setinfo";
}

export function squareSignup() {
  return apiUrl() + "/square/signup";
}

export function getAvatar() {
  return apiUrl() + "/user/getavatar";
}

export function userBuy() {
  return apiUrl() + "/user/buy";
}

export function userGetCards() {
  return apiUrl() + "/user/getcards";
}

export function restGetDetails() {
  return apiUrl() + "/rest/getdetails";
}

export function restGetPhoto() {
  return apiUrl() + "/rest/getphoto";
}

export function searchCoords() {
  return apiUrl() + "/search/coords";
}

export function restRedeemCard() {
  return apiUrl() + "/rest/redeemcard";
}

export function restGetLocations() {
  return apiUrl() + "/rest/getlocations";
}

export function restSetLocation() {
  return apiUrl() + "/rest/setlocation";
}

export function restVerifyCall() {
  return apiUrl() + "/rest/verifycall";
}

export function restVerifyCode() {
  return apiUrl() + "/rest/verifycode";
}

export function restPublish() {
  return apiUrl() + "/rest/publish";
}

export function restRefer() {
  return frontUrl() + "/refer";
}

export function restContract() {
  return apiUrl() + "/rest/contract";
}

export function restGetReport() {
  return apiUrl() + "/rest/report";
}

export function restAddPhotos() {
  return apiUrl() + "/rest/addphotos";
}