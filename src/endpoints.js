import React from "react";

export function apiUrl () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech",
        dev:  "https://devapi.benevolentbites.tech",
        local: "http://localhost:9000"
    }
    return dict[env.toLowerCase()];
}

export function frontUrl () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://benevolentbites.tech",
        dev:  "https://dev.benevolentbites.tech",
        local: "http://localhost:9000"
    }
    return dict[env.toLowerCase()];
}

export function restLogin () {
    return apiUrl() + "/rest/signup"
}

export function userLogin () {
    return apiUrl() + "/user/signup"
}

export function authVerify () {
    return apiUrl() + "/verify"
}

export function restGetInfo () {
    return apiUrl() + "/rest/getinfo"
}

export function restSetInfo () {
    return apiUrl() + "/rest/setinfo"
}

export function restSetPassword () {
    return apiUrl() + "/rest/setpassword"
}

export function userGetInfo () {
    return apiUrl() + "/user/getinfo"
}

export function userSetInfo () {
    return apiUrl() + "/user/setinfo"
}

export function squareSignup () {
    return apiUrl() + "/square/signup"
}

export function getAvatar () {
    return apiUrl() + "/user/getavatar"
}

export function userBuy () {
    return apiUrl() + "/user/buy"
}

export function userGetCards () {
    return apiUrl() + "/user/getcards"
}

export function restGetDetails () {
    return apiUrl() + "/rest/getdetails"
}

export function restGetPhoto () {
    return apiUrl() + "/rest/getphoto"
}

export function searchCoords () {
    return apiUrl() + "/search/coords"
}

export function restRedeemCard () {
    return apiUrl() + "/rest/redeemcard"
}