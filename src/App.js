import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import gql from "graphql-tag";
import { ApolloProvider, Subscription } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";

import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";

const GRAPHQL_ENDPOINT = "ws://localhost:8870/ws";

const subClient = new SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true,
  connectionParams: {
    authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiY2U3ODNlM2EtYWRkNi00ZDQ0LTg0YWYtZjhhNjM5MGViYmNlIiwiaWF0IjoxNTMzMzAzMzM2LCJleHAiOjE1MzMzODk3MzZ9.x9c10qtZzbrtJNHnOam3-BxO3sAzlruAT6Gkzai_R5E"
  },
});

const link = new WebSocketLink(subClient);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),

});

const COMMENTS_SUBSCRIPTION = gql`
  subscription TestSub {
    deploymentLogStream {
      timestamp
      level
      message
    }
  }
`;

class App extends Component {
  render() {
    return (
      <ApolloProvider client={ client }>
        <Subscription
          subscription={COMMENTS_SUBSCRIPTION}
          variables={{ }}
        >
          { (result) => {
            const data = result.data;
            const loading = result.loading;
            console.log(result);
            if (!data) {
              return null;
            }
            console.log(data.deploymentLogs);

            return (
              <h4>New comment: {!loading && JSON.stringify(data.deploymentLogs)}</h4>
            )
          }}
        </Subscription>
      </ApolloProvider>
    );
  }
}

export default App;
