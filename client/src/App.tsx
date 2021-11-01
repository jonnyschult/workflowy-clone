import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import client from "./apollo/apolloClient";
import { tasksVar, userVar } from "./apollo/reactiveVars";
import { GET_TASKS, GET_USER } from "./apollo/queryDefs";
import User from "./types/user";
import Home from "./components/Home";
import ButtonAppBar from "./components/AppBar";
import ErrorPage from "./components/ErrorPage";

const App: React.FC = () => {
  const [getTasks, { loading, error }] = useLazyQuery(GET_TASKS, {
    onCompleted(data) {
      tasksVar(data.getTasks.tasks);
    },
    onError(error) {
      console.log("Error in getTasks", error);
    },
    fetchPolicy: "network-only",
  });

  const getUser = useQuery(GET_USER, {
    onCompleted(data) {
      userVar(data.getUser.user);
      console.log("GetUserFired");
      getTasks();
    },
    onError(error) {
      console.log("Error in getUser", error);
      userVar(null);
    },
  });

  const logoutHandler = async () => {
    localStorage.removeItem("token");
    await client.resetStore();
    userVar(null);
    tasksVar([]);
  };

  const loginHandler = (user: User, token: string) => {
    localStorage.setItem("token", token);
    getTasks();
    setTimeout(() => {
      userVar(user);
    }, 1200);
  };

  return (
    <>
      <Router>
        <ButtonAppBar
          loginHandler={loginHandler}
          logoutHandler={logoutHandler}
        />
        {getUser.error || error ? (
          <ErrorPage
            errorMessage={`${getUser.error?.message} ${error?.message}`}
          />
        ) : (
          <Switch>
            <Route exact path="/">
              <Home loading={getUser.loading || loading} />
            </Route>
            <Route path="/task/:id">
              <Home loading={getUser.loading || loading} />
            </Route>
          </Switch>
        )}
      </Router>
    </>
  );
};

export default App;
