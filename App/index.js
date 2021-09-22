import React, { Component } from "react";

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import _ from "lodash";
import { ListItem, SearchBar, Avatar } from "react-native-elements";
import { getUsers, contains } from "./api/index";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = _.debounce(() => {
    this.setState({ loading: true });

    getUsers(20, this.state.query)
      .then((users) => {
        this.setState({
          loading: false,
          data: users,
          fullData: users,
        });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
  }, 250);

  handleSearch = (text) => {
    const formattedQuery = text.toLowerCase();
    const data = _.filter(this.state.fullData, (user) => {
      return contains(user, formattedQuery);
    });
    this.setState({ data, query: text }, () => this.makeRemoteRequest());
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%",
        }}
      />
    );
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={this.handleSearch}
        value={this.state.query}
      />
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView>
        <StatusBar style="light-content" />
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem bottomDivider>
              <Avatar source={{ uri: item.picture.thumbnail }} rounded />
              <ListItem.Content>
                <ListItem.Title>{`${item.name.first} ${item.name.last}`}</ListItem.Title>
                <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
          keyExtractor={(item) => item.email}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
        />
      </SafeAreaView>
    );
  }
}

export default App;
