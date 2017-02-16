import React, { Component } from 'react';
import './App.css';
import  {getJSON} from 'jquery';

const RATEURL = 'http://118.89.142.46:7777/';

export default class Rate extends Component {
  constructor(props) {
    super(props);
    this.state={
      rateData:{
        price:[],
        name:[],
        updateTime:''
      },
      basePos: 0,
      userInput: 1,
    };
    
    this.getRate = this.getRate.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.changeBase = this.changeBase.bind(this);
  }

  getRate(){
    getJSON(RATEURL, (data) => {
      let price = [];
      let name = [];
      let tmp = data.result[0];
      let updateTime = `${tmp['data1']['date']} ${tmp['data1']['time']}`;
      for(let v in tmp){
        name.push(tmp[v]['name']);
        price.push(100 / tmp[v]['bankConversionPri']);
      }

      //手动添加人民币
      name.unshift('人民币');
      price.unshift(1);

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

  changeValue(e){
    this.setState({userInput: e.target.value});
  }

  changeBase(pos){
    
    this.setState({
      basePos:pos
    });
  }

  render(){
    return(
      <div className="rate-box">
        <RateHead time={this.state.rateData.updateTime} />
        <Ratebase onChangeValue={this.changeValue} {...this.state}/>
        <Rateshow onChangeBase={this.changeBase} {...this.state} />
      </div>
    );
  }
}



class RateHead extends Component {

  render() {
    return (
      <div className="rate-time">
        <h1>货币汇率</h1>
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
        <label htmlFor="base-input" className="base-name">{this.props.rateData.name[this.props.basePos]}：</label>
        <input
          type="text"
          id="base-input"
          placeholder="请输入要转换数量"
          value={this.props.userInput}
          onChange={this.props.onChangeValue}
          maxLength="20"
        />
        <span className="base-tip">{isNaN(Number(this.props.userInput)) ? '你...你这...你这多少钱?' : ''}</span>
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

              <span className="rate-name" title="点击切换" onClick={this.props.onChangeBase.bind(null,i)}>
                {this.props.rateData.name[i]}：
              </span>

              <span className="rate-number" key={`rateprice${i}`}>
                {(v * this.props.userInput / this.props.rateData.price[this.props.basePos]).toFixed(2)}
              </span>
              
            </li>
          );
        })
      }
      </ul>
    );
  }
}
