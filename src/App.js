import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      amiibo: [],
      more: [],
      modal: false,
      page: 0,
      type: "",
      gameSeries: "",
      character: ""
    };
  }

  changeHandler(key, e) {
    this.setState({ [key]: e.target.value });
    this.setState({ page: 0 });
  }

  changePage(direction) {
    if (direction === "up") {
      this.setState({ page: this.state.page + 8 });
    } else if (direction === "down") {
      this.setState({ page: this.state.page - 8 });
    }
  }

  seeMore(tail) {
    let item = this.state.amiibo.filter(elem => elem.tail === tail);
    this.setState({ more: item });
    this.setState({ modal: true });
  }

  closeMore() {
    this.setState({ more: [] });
    this.setState({ modal: false });
  }

  componentDidMount() {
    axios
      .get("http://www.amiiboapi.com/api/amiibo")
      .then(result => this.setState({ amiibo: result.data.amiibo }));
  }
  render() {
    let modalDisplay = this.state.more.map(elem => (
      <div key={elem.tail}>
        <img className="modalImg" src={elem.image} alt={elem.character} />
        <h2>{elem.character}</h2>
        <h4>
          Series: {elem.gameSeries} <br /> Release: {elem.release.na}
        </h4>
      </div>
    ));
    let display = this.state.amiibo
      .filter(item =>
        item.character
          .toUpperCase()
          .includes(this.state.character.toUpperCase())
      )
      .filter(item =>
        item.gameSeries
          .toUpperCase()
          .includes(this.state.gameSeries.toUpperCase())
      )
      .filter(item =>
        item.type.toUpperCase().includes(this.state.type.toUpperCase())
      )
      .map(elem => (
        <div
          onClick={() => this.seeMore(elem.tail)}
          className="card"
          key={elem.tail}
        >
          <img className="img" src={elem.image} alt={elem.character} />
          <h2>
            {elem.name} :{elem.type}
          </h2>
          <h4>Series: {elem.gameSeries}</h4>
        </div>
      ));
    let finalDisplay = display.slice(this.state.page, this.state.page + 8);
    return (
      <div className="App">
        <header className="App-header">
          Amiibo{" "}
          <div>
            Name:
            <input
              onChange={e => this.changeHandler("character", e)}
              value={this.state.character}
            />
          </div>
          <div>
            {" "}
            Series:
            <input
              onChange={e => this.changeHandler("gameSeries", e)}
              value={this.state.gameSeries}
            />
          </div>
          <div>
            Type:
            <input
              onChange={e => this.changeHandler("type", e)}
              value={this.state.type}
            />
          </div>
        </header>
        <div className="cardContainer">{finalDisplay}</div>
        {this.state.modal === true ? (
          <div className="modal">
            {modalDisplay}
            <button onClick={() => this.closeMore()}>Close</button>
          </div>
        ) : null}
        <div className="bottomButtons">
          {this.state.page > 0 ? (
            <button onClick={() => this.changePage("down")}>Back</button>
          ) : null}
          {1 + this.state.page / 8 < Math.ceil((display.length - 1) / 8) ? (
            <button onClick={() => this.changePage("up")}>Next</button>
          ) : null}
        </div>
        <h2>
          Page {1 + this.state.page / 8} of{" "}
          {Math.ceil((display.length - 1) / 8)}
        </h2>
      </div>
    );
  }
}

export default App;
