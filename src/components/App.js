import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Dreadit from "../abis/Dreadit.json";
import Navbar from "./Navbar";
import Main from "./Main";

//Declare IPFS
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non Ethereum Broser detected. Try Using metamask :)");
    }
  }

  async loadBlockChainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = Dreadit.networks[networkId];
    if (networkData) {
      const dreadit = web3.eth.Contract(Dreadit.abi, networkData.address);
      this.setState({ dreadit: dreadit });
      const imagesCount = await dreadit.methods.imageCount().call();
      this.setState({ imagesCount: imagesCount });

      for (var i = 1; i <= imagesCount; i++) {
        const image = await dreadit.methods.images(i).call();
        this.setState({
          images: [...this.state.images, image],
        });
      }

      this.setState({
        images: this.state.images.sort((a, b) => b.tipAmount - a.tipAmount),
      });

      this.setState({ loading: false });
    } else {
      window.alert("Contract Not Deployed on this network. ");
    }
  }

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  };

  uploadImage = (description) => {
    console.log("Submitting file to ipfs...");

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log("Ipfs result", result);
      if (error) {
        console.error(error);
        return;
      }

      this.setState({ loading: true });
      this.state.dreadit.methods
        .uploadImage(result[0].hash, description)
        .send({ from: this.state.account })
        .on("transactionHash", (hash) => {
          this.setState({ loading: false });
        });
    });
  };

  tipImageOwner = (id, tipAmount) => {
    this.setState({ loading: true });
    this.state.dreadit.methods
      .tipImageOwner(id)
      .send({ from: this.state.account, value: tipAmount })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      dreadit: null,
      images: [],
      loading: true,
    };
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {this.state.loading ? (
          <div id="loader" className="text-center mt-5">
            <p>Loading...</p>
          </div>
        ) : (
          <Main
            images={this.state.images}
            captureFile={this.captureFile}
            uploadImage={this.uploadImage}
            tipImageOwner={this.tipImageOwner}
          />
        )}
      </div>
    );
  }
}

export default App;
