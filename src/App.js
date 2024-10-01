import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = {
manager : '',
players : [],
balance:'',
value:'',
message:''
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address)
    this.setState({ manager, players , balance});
  }

  onSubmit =async (event) =>{
    event.preventDefault();

    this.setState({message : 'Waiting for transaction success'});

    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: await web3.utils.toWei(this.state.value, 'ether')
    });
this.setState({message:'You have entered the lottery'})
  }

  onClick = async () =>{
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting for transaction success'})

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    this.setState({message: 'Winner has beeen picked'});
  }


  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}<br />
          There are currently {this.state.players.length} players competitng to 
          win {web3.utils.fromWei(this.state.balance, 'ether')} ETHER.
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <div>
            <h4>Want to try your luck?</h4>
            <label>Amount of ether to enter</label>
            |<input 
            value={this.state.value}
            onChange={event => this.setState({value: event.target.value})}>
            </input>
          </div>
          <button>ENTER</button>
        </form>
        <hr />
        <h4>READY TO PICK A WINNER?</h4>
        <button onClick={this.onClick}>Pick a WINNNER!</button>
        <hr />
        <h2>{this.state.message}</h2>
      </div>
    );
  }
}
export default App;