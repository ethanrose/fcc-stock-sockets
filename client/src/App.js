import React, { Component } from 'react';

import './App.css';

import $ from 'jquery';
import Navbar from './Navbar.js';
import ReactHighcharts from 'react-highcharts';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';








class App extends Component {

    constructor(){
        super();
        this.state = {
            connected: false,
            query: '',
            viewing: []
        }
    }

    componentDidMount(){

        //websocket event handlers
        var HOST = location.origin.replace(/^http/, 'ws') + '/a'
        const socket = new WebSocket(HOST);
        socket.onopen = (e)=>{
            console.log('connected to: ' + e.currentTarget.url);
            this.setState({connected: true})
        }
        socket.onerror = (e)=>{
            console.log(e)
            this.setState({connected: false})
        }
        socket.onclose = (e)=> {
            this.setState({connected: false})
        }
        socket.onmessage = (e)=> {
            this.setState({viewing: JSON.parse(e.data)})
        }


        //handle submitting a query
        document.getElementById('queryForm').onsubmit = (e)=>{
            e.preventDefault();

            //make the request to quandl for symbol data
            let stockDataUrl = `https://www.quandl.com/api/v3/datasets/WIKI/${this.state.query}.json?column_index=4&order=asc&collapse=quarterly&start_date=2012-01-01&api_key=tTJ5U8KfsBRgDbPTGyL1`
            $.ajax({
                type: 'get',
                url: stockDataUrl,
                success: (res)=>{
                    console.log(res);
                    document.getElementById('searchBoxFormGroup').className = "form-group"
                    socket.send(JSON.stringify(res.dataset))
                    this.setState({query: ''})
                },
                error: (res)=>{
                    console.log('no such symbol.')
                    document.getElementById('searchBoxFormGroup').className = "form-group has-error"
                }
            })
        }

        //exchange rate data
        let exchangeRateUrl = 'https://openexchangerates.org/api/latest.json?app_id=220dd7ddd5484fad8ec55528dbda1029'
        $.get(exchangeRateUrl, function(res){
            console.log(res)
        })
    }

    handleQueryChange(e){
        this.setState({query: e.target.value})
    }

    handleClose(e){
        $.get('/api/removeSymbol/' + e.target.value)
    }

    render() {

        //chart configuration
        var config = {
            title: {
                text: 'Stock Prices'
            },
            series: [],
            scrollbar: {
                enabled: false
            },
            tooltip: {
                valueDecimals: 2
            }
        };

        this.state.viewing.map((stock)=>{
            let dataArr = []
            stock.data.map(function(point){
                let d = new Date(point[0]).getTime()
                dataArr.push([d, point[1]])
            })
            config.series.push({
                name: stock.dataset_code,
                data: dataArr
            })
        })


        return (
            <div className="App">
                <Navbar
                    connected={this.state.connected}
                />



                {/*CHART*/}
                <div className="container">
                    <div className="chart-card">
                        {this.state.viewing &&
                        <ReactHighstock config={config} />
                        }
                    </div>
                </div>
                <br/><br/>



                {/*SEARCH BOX*/}
                <div className="container">
                    <div id="search-container">
                        <form id="queryForm">
                            <div className="form-group" id="searchBoxFormGroup">
                                <label className="control-label">Symbol</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" onChange={(e)=>this.handleQueryChange(e)} value={this.state.query} />
                                    <span className="input-group-btn">
                                        <button className="btn btn-info" type="submit">Search</button>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/*LIVE STOCKS IN THE VIEW*/}
                <div className="viewing-container">
                {this.state.viewing && this.state.viewing.map((symbol, i)=> {
                    return (
                        <div className="viewing-box" key={i}>
                            <button type="button" value={i} className="close close-button" onClick={(e)=>this.handleClose(e)}>&times;</button>
                            <div className="panel panel-info">
                                <div className="panel-heading">
                                    <h3 className="panel-title">{symbol.dataset_code}</h3>
                                </div>
                                <div className="panel-body">
                                    {symbol.name}<br/>
                                    <b className="text-success">${symbol.data[symbol.data.length - 1][1]}</b>
                                </div>
                            </div>
                        </div>
                    )
                })
                }
                </div>

            </div>
        );
    }

}

export default App;
