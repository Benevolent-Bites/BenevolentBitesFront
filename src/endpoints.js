import React from "react";

export function frontUrl () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://benevolentbites.tech",
        dev:  "https://dev.benevolentbites.tech"
    }
    return dict[env.toLowerCase()];
}

export function restLogin () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/rest/signup",
        dev:  "https://devapi.benevolentbites.tech/rest/signup"
    }
    return dict[env.toLowerCase()];
}

export function userLogin () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/user/signup",
        dev:  "https://devapi.benevolentbites.tech/user/signup"
    }
    return dict[env.toLowerCase()];
}

export function authVerify () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/verify",
        dev:  "https://devapi.benevolentbites.tech/verify"
    }
    return dict[env.toLowerCase()];
}

export function restGetInfo () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/rest/getinfo",
        dev:  "https://devapi.benevolentbites.tech/rest/getinfo"
    }
    return dict[env.toLowerCase()];
}

export function restSetInfo () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/rest/setinfo",
        dev:  "https://devapi.benevolentbites.tech/rest/setinfo"
    }
    return dict[env.toLowerCase()];
}

export function restSetPassword () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/rest/setpassword",
        dev:  "https://devapi.benevolentbites.tech/rest/setpassword"
    }
    return dict[env.toLowerCase()];
}

export function userGetInfo () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/user/getinfo",
        dev:  "https://devapi.benevolentbites.tech/user/getinfo"
    }
    return dict[env.toLowerCase()];
}

export function userSetInfo () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/user/setinfo",
        dev:  "https://devapi.benevolentbites.tech/user/setinfo"
    }
    return dict[env.toLowerCase()];
}

export function squareSignup () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/square/signup",
        dev:  "https://devapi.benevolentbites.tech/square/signup"
    }
    return dict[env.toLowerCase()];
}

export function getAvatar () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/user/getavatar",
        dev:  "https://devapi.benevolentbites.tech/user/getavatar"
    }
    return dict[env.toLowerCase()];
}

export function userBuy () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/user/buy",
        dev:  "https://devapi.benevolentbites.tech/user/buy"
    }
    return dict[env.toLowerCase()];
}

export function userGetCards () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/user/getcards",
        dev:  "https://devapi.benevolentbites.tech/user/getcards"
    }
    return dict[env.toLowerCase()];
}

export function restGetDetails () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/rest/getdetails",
        dev:  "https://devapi.benevolentbites.tech/rest/getdetails"
    }
    return dict[env.toLowerCase()];
}

export function restGetPhoto () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/rest/getphoto",
        dev:  "https://devapi.benevolentbites.tech/rest/getphoto"
    }
    return dict[env.toLowerCase()];
}

export function searchCoords () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/search/coords",
        dev:  "https://devapi.benevolentbites.tech/search/coords"
    }
    return dict[env.toLowerCase()];
}

export function restRedeemCard () {
    const env = process.env.REACT_APP_ENV;
    const dict = {
        prod: "https://api.benevolentbites.tech/rest/redeemcard",
        dev:  "https://devapi.benevolentbites.tech/rest/redeemcard"
    }
    return dict[env.toLowerCase()];
}