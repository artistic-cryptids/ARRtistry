import * as React from 'react';

interface UserProps {
  drizzle: any;
  drizzleState: any;
}

interface UserState {
  dataKey: any;
}

/* Class just for testing if data can be retrieved from blockchain */
class User extends React.Component<UserProps, UserState> {
  constructor (props: UserProps) {
    super(props);

    this.state = { dataKey: null };
  }

  componentDidMount (): void {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Users;

    // get and save the key for the variable we are interested in
    const dataKey = contract.methods.totalUsers.cacheCall();
    this.setState({ dataKey });
  }

  render (): React.ReactNode {
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
