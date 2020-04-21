import React from "react";
import { Typography, Card, IconButton, Box } from "@material-ui/core";
import Cookies from "js-cookie";
import { login, authVerify, getAvatar } from "../endpoints";

let centerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: 10,
};

// Login handler manages user logins, and shows children after
// user is successfully logged in.

export default function LoginHandler(props) {
  const { text, children, type } = props;

  const queryString = new URLSearchParams(window.location.search);

  const initialSignedIn = Cookies.get("signed_in") === "1" || null;

  const [avatarSrc, setAvatarSrc] = React.useState("");
  const [signedIn, setSignedIn] = React.useState(initialSignedIn);

  let VerifyLogin = () => {
    window
      .fetch(authVerify(), {
        method: "GET",
        credentials: "include",
        mode: "cors",
        cache: "no-cache",
      })
      .then((result) => {
        const data = result.json();
        if (!result.ok) {
          throw new Error(data.error);
        }
        return data;
      })
      .then(
        (result) => {
          Cookies.set("signed_in", "1", { expires: 1 / 24 }); // 1/24 days = 1 hour
          window.location.replace(
            window.location.origin + window.location.pathname
          );
          setSignedIn(true);
        },
        (error) => {
          console.log(error);
          setSignedIn(false);
        }
      );
  };

  let SignIn = () => {
    if (!initialSignedIn) {
      window.location.assign(login(type));
    }
  };

  let CheckLogin = () => {
    if (queryString.get("login") === "success") {
      VerifyLogin();
    }
  };

  let EnsureAvatar = () => {
    if (signedIn && avatarSrc === "") {
      console.log("CALLING");
      window
        .fetch(getAvatar(), {
          mode: "cors",
          credentials: "include",
          method: "GET",
          cache: "no-cache",
        })
        .then((result) => {
          if (!result.ok) {
            throw new Error();
          }
          return result.json();
        })
        .then(
          (response) => {
            setAvatarSrc(response.avatar);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  };

  let UpdatedChildren = () => {
    return React.Children.map(children, (child) =>
      React.cloneElement(child, { signedIn: signedIn, avatarSrc: avatarSrc })
    );
  };

  CheckLogin();
  EnsureAvatar();

  if (!signedIn) {
    return (
      <Card
        style={{
          marginLeft: "30%",
          marginRight: "30%",
          marginTop: "15%",
          marginBottom: "25%",
          padding: 25,
        }}
      >
        <Typography style={centerStyle}>{text}</Typography>
        <Box style={centerStyle}>
          <IconButton
            style={{
              ...{
                backgroundColor: "transparent",
              },
              ...centerStyle,
            }}
            onClick={() => {
              SignIn();
            }}
            disableRipple
            disableFocusRipple
            disableElevation
          >
            <img
              alt="restaurant"
              src={process.env.PUBLIC_URL + "/img/google_signin.png"}
              style={{ ...{ width: 200, height: 50 }, ...centerStyle }}
            />
          </IconButton>
        </Box>
      </Card>
    );
  } else {
    return UpdatedChildren();
  }
}
