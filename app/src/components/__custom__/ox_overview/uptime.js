import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

class Uptime extends Component {

  constructor(props) {
    super(props);
    this.state = {
      default: true,
      startTime: '11/02/16',
      endTime: '12/02/16' 
    }
  }

  componentWillMount() {
    
  }

  componentDidMount() {
    const url = 'http://10.137.19.200/api/v1/instrumar/ox/uptime/'
    axios.get()
  }
}