import React from "react";
import Header from "./Header";
//import './App.css';
import "./App.scss";
import "./firebase/config";
import "./pages/Signup";
import { Route, Switch, BrowserRouter, Redirect, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { UserProvider } from "./firebase/UserProvider";
import Profile from "./pages/Profile";
import ProviderProfile from "./pages/ProviderProfile";
import AddReading from "./pages/AddReading";
import ListReading from "./pages/ListReadings";
import Report from "./pages/Report";
import MetricAvgReadings from "./pages/MetricAvgReadings";
import MetricGender from "./pages/MetricGender";
import MetricGenderAge from "./pages/MetricGenderAge";
import Override from "./pages/Override";
import ExportReadings from "./pages/ExportReadings";
import MetricBaselineReadings from "./pages/MetricBaselineReadings";
import Samples from "./pages/Samples";
import Notifications from "./pages/Notifications";
import ProfileRedirect from "./router/ProfileRedirect";
import PrivateRoute from "./router/PrivateRoute";
import AdminRoute from "./router/AdminRoute";
import DoctorRoute from "./router/DoctorRoute";
import Users from "./pages/Users";
import ListPatients from "./pages/ListPatients";
import ListDoctorsPatients from "./pages/ListDoctorsPatients";
import Patient from "./pages/Patient";
import JoinForm from "./components/JoinForm";
// https://dev.to/ammartinwala52/clear-cache-on-build-for-react-apps-1k8j
import packageJson from "../package.json";
import { getBuildDate } from "./utils/utils";
import withClearCache from "./ClearCache";
import PasswordReset from "./components/PasswordReset";
import ListRegistrations from "./pages/ListRegistrations";

//import InstallPrompt  from "./utils/InstallToHomeScreen.js";
//import AddToHomeScreen from '@ideasio/add-to-homescreen-react';
//import { ExampleComponent } from "./utils/AddToHomescreenButtons";

const ClearCacheComponent = withClearCache(MainApp);

function App() {
  return <ClearCacheComponent />;
}

function browserTypeVersion() {
  console.log(navigator?.userAgent,navigator?.appName,navigator?.appVersion)
  return [navigator?.userAgent,navigator?.appName,navigator?.appVersion].join(' ')
}
let deferredPrompt;

window.addEventListener("appinstalled", () => {
  console.log("my.SmartViewMD.com [Added to HomeScreen] ");

  // Hide the app-provided install promotion
  //hideInstallPromotion();
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  // Optionally, send analytics event to indicate successful install
  console.log("PWA was installed");
});

window.addEventListener("beforeinstallprompt", (event) => {
  console.log("my.SmartViewMD.com ... [Add to HomeScreen] feature ready ...");

  // Prevent Chrome 67 and earlier from automatically showing the prompt
  event.preventDefault();

  // Stash the event so it can be triggered later.
  deferredPrompt = event;
  // Attach the install prompt to a user gesture
  document.querySelector("#installBtn").addEventListener("click", (event) => {
    if (deferredPrompt !== null) {
      // Show the prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        deferredPrompt = null;
      });
    }
  });

  // Update UI notify the user they can add to home screen
  document.querySelector("#installBanner").style.display = "flex";
});

function MainApp(props) {
  const VERSION = require("../package.json").version;
  console.log(process.env.NODE_ENV, VERSION);

  const removeAll = () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    if ("caches" in window) {
      caches.keys().then((names) => {
        // Delete all the cache files
        names.forEach((name) => {
          caches.delete(name);
        });
      });

      // Makes sure the page reloads. Changes are only visible after you refresh.
      window.location.reload(true);
    }
    alert("Cleared Storage & Cache");
  };

  const InstallApp = () => {
    if (deferredPrompt == null) {
      alert(
        `From many supported modern web browsers, you can install this my.SmartViewMD.com app. On the Google Chrome menu of an Android phone, select [Add to Home screen]. Similarly on an iPhone, the web browser provived a download icon (at bottom of initial page launch) or menu to [Add to Home screen] as shown in our BLOG video "How to set up SmartViewMD Application" from www.SmartViewMD.com/V1 ... ${browserTypeVersion()}`
      );
    } else {
      console.log("Prompting for A2HS...");
      // Show the prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        deferredPrompt = null;
      });
    }
  };
  // requestFirebaseNotificationPermission()
  // .then((firebaseToken) => {
  //   // eslint-disable-next-line no-console
  //   alert("Hi there fBt:")
  //   console.log("fBt: ", firebaseToken);
  // })
  // .catch((err) => {
  //   alert("Oops")
  //   console.log("requestFirebaseNotificationPermission Error: ", err);
  //   return err;
  // });

  // onMessageListener()
  // .then((listening)=>{
  //   console.log("list: ",listening)
  // })
  // .catch((err) => {
  //   alert("Oops")
  //   console.log("onMessageListener Error: ", err);
  //   return err;
  // });

  return (
    <UserProvider>
      <BrowserRouter>
        <Header></Header>
        <div className="app">
          <div className="ui grid container">
            <Switch>
              <ProfileRedirect exact path="/signup" component={Signup} />
              <PrivateRoute exact path="/pprofile/:id" component={ProviderProfile} />
              <PrivateRoute exact path="/profile/:id" component={Profile} />
              <PrivateRoute exact path="/password/:id" component={JoinForm} />
              <PrivateRoute exact path="/reading/:id" component={AddReading} />
              <PrivateRoute
                exact
                path="/readings/:id/:name?"
                component={ListReading}
              />
              <PrivateRoute
                exact
                path="/reports/:id?/:name?"
                component={Report}
              />
              <PrivateRoute
                exact
                path="/avgReads/:interval?/:duration?"
                component={MetricAvgReadings}
              />              
              <PrivateRoute
                exact
                path="/genderReport"
                component={MetricGender}
              />
              <PrivateRoute
                exact
                path="/genderAgeReport"
                component={MetricGenderAge}
              />    
              <PrivateRoute
                exact
                path="/override"
                component={Override}
              /> 
              <PrivateRoute
                exact
                path="/exportReadings"
                component={ExportReadings}
              /> 
              <PrivateRoute
                exact
                path="/baselineReads/:interval?/:duration?"
                component={MetricBaselineReadings}
              />
              <PrivateRoute
                exact
                path="/samples/:id?/:device?"
                component={Samples}
              />
              <PrivateRoute
                exact
                path="/notify/:id?/:device?"
                component={Notifications}
              />
              <ProfileRedirect exact path="/login" component={Login} />
              <ProfileRedirect exact path="/resetpw" component={PasswordReset} />
              <AdminRoute exact path="/users/:type?" component={Users} />
              <DoctorRoute exact path="/patients/:type?" component={ListPatients} />
              <DoctorRoute exact path="/doctors/patients/:type?" component={ListDoctorsPatients} />
              <DoctorRoute exact path="/listRegistrations" component={ListRegistrations} />
              <PrivateRoute exact path="/patient/:id/:name?" component={Patient} />
              <Route exact path="/">
                <Redirect to="/login" />
              </Route>
            </Switch>
          </div>
        </div>
        <div className="centeredDiv">
          <button onClick={removeAll}>
            v{VERSION} {getBuildDate(packageJson.buildDate)}
          </button>
          <div style={{ marginLeft: ".9rem" }}>
            {
              (browserTypeVersion().includes("Android") )  ? 
              (
                <button onClick={InstallApp} id="installBtn">
                Install App
              </button>
              )
              :
              ("")
            }

          </div>
</div>
<div className="centeredDiv2">
Powered by  <div style={{ marginLeft: ".3rem" }}><a href="http://SmartViewMD.com" > SmartViewMD</a></div>
</div>        
        {/*
              (
                <div>For Bluetooth, please use "SmartViewMD", "WebBLE" or "Bluefy" app on iPhone for SmartViewMD.</div>
              )
          <p align="center" style={{ lineHeight: "6" }}></p> 

onClick={hide} 

          

        */}
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
