import React, {Component} from 'react';

export default class Navbar extends Component {
    render(){
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">FCC-Stock-Sockets</a>
                    </div>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="#">
                                {this.props.connected

                                ?

                                <div id="status-box" className="text-success">
                                    &#9679; Online
                                </div>

                                :

                                <div id="status-box" className="text-danger">
                                    &#9679; Offline
                                </div>

                                }
                            </a></li>
                        </ul>
                </div>
            </nav>
        )
    }
}