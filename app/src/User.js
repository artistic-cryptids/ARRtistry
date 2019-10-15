import React, { Component } from 'react';

/* Class just for testing if data can be retrieved from blockchain */
class User extends Component {
  state = { dataKey: null };

  componentDidMount () {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Users;

    // get and save the key for the variable we are interested in
    const dataKey = contract.methods.totalUsers.cacheCall();
    this.setState({ dataKey });
  }

  render () {
    const { Users } = this.props.drizzleState.contracts;
    const totalUsers = Users.totalUsers[this.state.dataKey];
    return (
      <div>
        {totalUsers && <h1>Total Users: {totalUsers.value}</h1>}
      </div>
    );
  }
}

export default User;
