import React, { Component } from 'react';
import './App.css';
import  {getJSON} from 'jquery';

class Rate extends Component {
  constructor(props) {
    super(props);
    this.state={
      rateData:{
        price:[],
        name:[],
        updateTime:''
      },
      userInput: '1',
    };
    this.getRate = this.getRate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getRate(){
    getJSON('http://123.206.211.247:7777/', (data) => {
      let price = [];
      let name = [];
      let tmp = data.result[0];
      let updateTime = `${tmp['data1']['date']} ${tmp['data1']['time']}`;
      for(let v in tmp){
        name.push(tmp[v]['name']);
        price.push(100 / tmp[v]['bankConversionPri']);
      }
      this.setState({
        rateData:{
          price: price,
          name: name,
          updateTime: updateTime
        }
      });
    });
  }

  componentDidMount() {
    this.getRate();
  }

  handleChange(e){
    this.setState({userInput: e.target.value});
  }

  render(){
    return(
      <div className="rate-box">
        <h1>货币汇率</h1>
        <Ratetime time={this.state.rateData.updateTime} />
        <Ratebase val={this.state.userInput} onChangeValue={this.handleChange} />
        <Rateshow {...this.state} />
      </div>
    );
  }
}


class Ratetime extends Component {

  render() {
    return (
      <div className="rate-time">
        <span>最新更新：</span>
        <span>{this.props.time}</span>
      </div>
    );
  }
}

class Ratebase extends Component {

  render() {
    return (
      <div className="rate-base">
        <label htmlFor="base-input">人民币：</label>
        <input
          type="text"
          id="base-input"
          placeholder="请输入要转换数量"
          value={this.props.val}
          onChange={this.props.onChangeValue}
          maxLength="20"
        />
        <span className="base-tip">{isNaN(Number(this.props.val)) ? '你...你这...你这多少钱?' : ''}</span>
      </div>
    );
  }
}

class Rateshow extends Component {

  render() {
    return (
      <ul className="rate-list">
      {
        this.props.rateData.price.map((v, i)=>{
          return(
            <li className="rate-item clearfix" key={`ratename${i}`}>

              <span className="rate-name">
                {this.props.rateData.name[i]}：
              </span>

              <span className="rate-number" key={`rateprice${i}`}>
                {(v * this.props.userInput).toFixed(2)}
              </span>
              
            </li>
          );
        })
      }
      </ul>
    );
  }
}


export default Rate;
