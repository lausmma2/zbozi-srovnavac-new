import React, { Component } from 'react';
import './App.css';
import xmlData from "./feed.js"
import { Card, DropdownButton, Dropdown } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import diacritics from "diacritics";
import parser from "fast-xml-parser";
import 'animate.css/animate.compat.css';

class App extends Component {
  constructor() {
    super();
    var jsonObj = parser.parse(xmlData);
    this.state = {
      array: jsonObj,
      price: "10000",
      text: "",
      brands: [],
      brand: "",
      limit: 24,
      isAllClicked: false,
      item: jsonObj.rss.channel.item,
      filteredBrands: []
    };
  }

  componentDidMount() {
    const item = this.state.array.rss.channel.item;

    //Naplnění pole jednotlivých brandů
    item.map(filteredItem =>
      this.state.brands.push(filteredItem.brand)
    )

    const uniqueArray = new Set(this.state.brands);
    const backToArray = [...uniqueArray];

    this.setState({
      item: item,
      filteredBrands: backToArray
    })
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onClick() {
    this.setState({ limit: this.state.limit + 10 })
  }

  onDropdownClick(chosenBrand) {
    this.setState({
      brand: chosenBrand,
      isAllClicked: true,
      text: ""
    }, () => { console.log(this.state) })
  }

  onCheck() {
    this.setState({ isChecked: !this.state.isChecked })
  }

  onDropdownAllClick() {
    this.setState({
      text: "",
      brands: [],
      brand: "",
      limit: 24,
      isAllClicked: false
    }, () => { console.log(this.state) })
  }

  //TODO 24.06.2020 - dodělat trim na písmena??? Toť otázka...
  // například kel (najde nějaké produkty) - Kel (najde značku Kelly)
  //TODO 25.06.2020 - logiku přehodit nejspíš do componentDidMount 
  // => přidává to do toho pole stále další brandy

  render() {
    var testListDataPrice = "";

    if (this.state.isAllClicked) {
      testListDataPrice = this.state.item.filter(item1 => (item1.brand === this.state.brand.brand)
        && (item1.title.includes(this.state.text)
          || item1.description.includes(this.state.text)
          || diacritics.remove(item1.title).includes(this.state.text)
          || diacritics.remove(item1.description).includes(this.state.text))
        && parseInt(item1.price) <= this.state.price).slice(0, this.state.limit).map((filteredItem, key) =>
          <Card key={key} border="light" style={{ width: '17rem', display: "inline-block", margin: "0.5%" }}>
            <Card.Body>
              <Card.Title><a href={filteredItem.link} target="_blank" rel="noopener noreferrer">{filteredItem.title.substring(0, filteredItem.title.length - 1)}</a></Card.Title>
              <Card.Text><img src={filteredItem.image_link} alt={filteredItem.title.substring(0, filteredItem.title.length - 1)} width="80px" height="80px" /></Card.Text>
              <Card.Text>{filteredItem.description.substring(0, 50) + "..."}</Card.Text>
              <Card.Text>{filteredItem.price}</Card.Text>
            </Card.Body>
          </Card>
        );
    } else {
      testListDataPrice = this.state.item.filter(item1 => (item1.title.includes(this.state.text)
        || item1.description.includes(this.state.text)
        || diacritics.remove(item1.title).includes(this.state.text)
        || diacritics.remove(item1.description).includes(this.state.text))
        && parseInt(item1.price) <= this.state.price).slice(0, this.state.limit).map((filteredItem, key) =>
          <Card key={key} border="light" style={{ width: '17rem', display: "inline-block", margin: "0.5%" }}>
            <Card.Body>
              <Card.Title><a href={filteredItem.link} target="_blank" rel="noopener noreferrer">{filteredItem.title.substring(0, filteredItem.title.length - 1)}</a></Card.Title>
              <Card.Text><img src={filteredItem.image_link} alt={filteredItem.title.substring(0, filteredItem.title.length - 1)} width="80px" height="80px" /></Card.Text>
              <Card.Text>{filteredItem.description.substring(0, 50) + "..."}</Card.Text>
              <Card.Text>{filteredItem.price}</Card.Text>
            </Card.Body>
          </Card>
        );
    }

    return (
      <div className="App" style={{ backgroundColor: "#F8F8F8" }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-dark animated fadeIn">
          <a className="navbar-brand" style={{ marginLeft: "15%", color: "white" }} href="/">Srovnávač zboží</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div style={{ marginLeft: "42%" }} className="collapse navbar-collapse" id="navbarSupportedContent">
            <span style={{ color: "white", marginRight: "1%" }}>Vyhledat:</span>
            <form className="form-inline my-2 my-lg-0">
              <input style={{ marginLeft: "1%" }} className="form-control mr-sm-2" type="search" name="text" placeholder="kára" value={this.state.text} onChange={this.onChange.bind(this)} />
            </form>
          </div>
        </nav>
        <form style={{ padding: "1%", marginRight: "8%" }}>
          <span style={{ marginRight: "3%" }}>Cena do: <input type="number" name="price" placeholder="500" value={this.state.price} onChange={this.onChange.bind(this)} /> Kč</span>
        </form>
        <div style={{ marginTop: "-3%", marginLeft: "57%", width: "160px", height: "100px", overflowY: "auto" }}>
          <DropdownButton id="dropdown-basic-button" title="Vyberte značku">
            <Dropdown.Item as="button" onSelect={this.onDropdownAllClick.bind(this)}><b>Všechny</b></Dropdown.Item>
            <Dropdown.Divider />
            {this.state.filteredBrands.map((brand, key) => {
              return (
                <Dropdown.Item as="button" key={key} onSelect={this.onDropdownClick.bind(this, { brand })}>{brand}</Dropdown.Item>
              )
            })}
          </DropdownButton>
        </div>
        {!this.state.price ? (
          <div>Price cannot be 0!</div>
        ) : (
            <div>{testListDataPrice}</div>
          )
        }
        {
          testListDataPrice.length >= 24 ? (
            <button style={{ marginBottom: "3%", marginTop: "3%", padding: "10px", paddingLeft: "20px", paddingRight: "20px" }} type="button" className="btn btn-dark" onClick={this.onClick.bind(this)}>+ zobrazit dalších 10 položek</button>
          ) : (
              <p></p>
            )
        }
      </div >
    );
  }
}

export default App;