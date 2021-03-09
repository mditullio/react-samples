import React from "react";
// import GoogleApi from "./gapi";

declare const window: Window & { gapi: any };

// Client ID and API key from the Developer Console
var CLIENT_ID =
  "391274129012-45rko80rdrlkgbvcrkfvvlu0i427gh4b.apps.googleusercontent.com";
var API_KEY = "AIzaSyBUPwwJszELvjm2Hj6OVS85mayO4RJPHCU";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES =
  "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

const loadGoogleApi = (function() {
  var _isLoading = false;
  var _isLoaded = false;

  var _onLoad: (() => void)[] = [];
  var _onError: (() => void)[] = [];

  const handleScriptLoaded = () => {
    _isLoaded = true;
    for (const currCallback of _onLoad) {
      try {
        currCallback();
      } catch {}
    }
  };

  const handleScriptError = () => {
    _isLoaded = true;
    for (const currCallback of _onError) {
      try {
        currCallback();
      } catch {}
    }
  };

  const addScriptTag = () => {
    if (!_isLoading && !window.gapi) {
      var tag = document.createElement("script");
      tag.async = true;
      tag.defer = true;
      tag.src = "https://apis.google.com/js/api.js";
      tag.onload = handleScriptLoaded;
      tag.onerror = handleScriptError;
      var head = document.getElementsByTagName("head")[0];
      head.appendChild(tag);
    }
    _isLoading = true;
  };

  return function(onLoad: () => void, onError?: () => void) {
    addScriptTag();
    if (!_isLoaded) {
      _onLoad.push(onLoad);
      if (onError) _onError.push(onError);
    } else {
      try {
        onLoad();
      } catch {}
    }
  };
})();

const App = (props: any) => {
  const [gapiLoaded, setGapiLoaded] = React.useState(false);

  const [signedIn, setSignedIn] = React.useState(false);

  const [data, setData] = React.useState<string>();

  const initClient = async () => {
    await window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPES
    });

    // Listen for sign-in state changes.
    window.gapi.auth2.getAuthInstance().isSignedIn.listen(setSignedIn);

    // Handle the initial sign-in state.
    setSignedIn(window.gapi.auth2.getAuthInstance().isSignedIn.get());
  };

  const handleAuthClick = async () => {
    window.gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignoutClick = () => {
    window.gapi.auth2.getAuthInstance().signOut();
  };

  React.useEffect(() => {
    loadGoogleApi(() => {
      window.gapi.load("client:auth2", initClient);
      setGapiLoaded(true);
    });
  }, []);

  React.useEffect(() => {
    if (signedIn) {
      window.gapi.client
        .request({
          path: "https://www.googleapis.com/userinfo/v2/me"
        })
        .then(
          function(response: any) {
            setData(JSON.stringify(response.result));
          },
          function(reason: any) {
            console.log("Error: " + reason.body);
          }
        );

      let body = Math.log(0.0001 * Math.random()).toString();
      let bodyLen = body.length;

      window.gapi.client
        .request({
          path:
            "https://www.googleapis.com/drive/v3/files/1dnOiizPFG08nTLLUXoxggRLdF6nSokGM?alt=media",
          method: "GET"
          // path: "https://www.googleapis.com/upload/drive/v3/files/1dnOiizPFG08nTLLUXoxggRLdF6nSokGM",
          //method: "PATCH",
          // path: "https://www.googleapis.com/upload/drive/v3/files",
          //method: "POST",
          // body: body,
          // headers: { "Content-Length": bodyLen }
        })

        .then(
          function(response: any) {
            setData(
              data => data + " ------- " + JSON.stringify(response.result)
            );
          },
          function(reason: any) {
            console.log("Error: " + reason.body);
          }
        );
    } else {
      setData("");
    }
  }, [signedIn]);

  return (
    <div>
      <div>Test Async Load</div>
      <div>
        {gapiLoaded && "Load completed"}
        {!gapiLoaded && "Loading Google Api ..."}
      </div>
      <div>
        <button
          id="authorize_button"
          style={{ display: signedIn ? "none" : "block" }}
          onClick={handleAuthClick}
        >
          Authorize
        </button>
        <button
          id="signout_button"
          style={{ display: signedIn ? "block" : "none" }}
          onClick={handleSignoutClick}
        >
          Sign Out
        </button>
        <div>{data}</div>
      </div>
    </div>
  );
};

export default App;
