import React from 'react';
import Workbook from 'react-excel-workbook';

import api from '../api/api';

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: null,
      fromDate: new Date(),
      toDate: new Date(),
    };
  }
  handleSearch = e => {
    e.preventDefault();

    let fromDate = this.toDatetimeLocal(this.state.fromDate);
    let toDate = this.toDatetimeLocal(this.state.toDate);
    api.get(`/reports?fromDate=${fromDate}&toDate=${toDate}`).then(response => {
      this.setState({ locations: response.data });
    });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  loadData = () => {
    if (!this.state.locations) return;

    return this.state.locations.map(
      ({ longitude, latitude, elevation, dateTime, Product }) => {
        return (
          <tr>
            <td>{Product.id}</td>
            <td>{Product.description}</td>
            <td>{longitude}</td>
            <td>{latitude}</td>
            <td>{elevation}</td>
            <td>{new Date(dateTime).toLocaleString()}</td>
          </tr>
        );
      }
    );
  };

  toDatetimeLocal = datetime => {
    if (!datetime) {
      return;
    }

    let date = new Date(datetime),
      ten = function(i) {
        return (i < 10 ? '0' : '') + i;
      },
      YYYY = date.getFullYear(),
      MM = ten(date.getMonth() + 1),
      DD = ten(date.getDate()),
      HH = ten(date.getHours()),
      II = ten(date.getMinutes()),
      SS = ten(date.getSeconds());
    return YYYY + '-' + MM + '-' + DD + 'T' + HH + ':' + II + ':' + SS;
  };

  exportExcel = () => {
    let filename = 'export.xlsx';
    return (
      <div
        className="row text-center"
        style={{ marginTop: '100px', display: 'inline' }}
      >
        <Workbook
          filename={filename}
          element={
            <button
              className="ui blue button"
              style={{ position: 'absolute', right: '0', marginRight: '1%' }}
            >
              Export
            </button>
          }
        >
          <Workbook.Sheet data={this.state.locations} name="Export Data">
            <Workbook.Column
              label="ProductID"
              value={location => location.Product.id}
            />
            <Workbook.Column
              label="Desciption"
              value={location => location.Product.description}
            />
            <Workbook.Column label="Longitude" value="longitude" />
            <Workbook.Column label="Latitude" value="latitude" />
            <Workbook.Column label="Elevation" value="elevation" />
            <Workbook.Column label="DateTime" value="dateTime" />
          </Workbook.Sheet>
        </Workbook>
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <div class="ui form">
          <div class="fields">
            <div class="field">
              <label>FromDate</label>
              <input
                onChange={this.handleChange}
                type="datetime-local"
                value={this.toDatetimeLocal(this.state.fromDate)}
                name="fromDate"
              />
            </div>
            <div class="field">
              <label>ToDate</label>
              <input
                onChange={this.handleChange}
                type="datetime-local"
                value={this.toDatetimeLocal(this.state.toDate)}
                name="toDate"
              />
            </div>
            <div class="field">
              <label>Search</label>
              <button className="ui green button" onClick={this.handleSearch}>
                Click
              </button>
            </div>
          </div>
        </div>
        <div class="field">
          <div className="ui huge header">
            Report
            {this.exportExcel()}
          </div>
        </div>

        <br />
        <table class="ui fixed single line called table">
          <thead>
            <tr>
              <th>ProductID</th>
              <th>Description</th>
              <th>Longitude</th>
              <th>Latitude</th>
              <th>Elevation</th>
              <th>DateTime</th>
            </tr>
          </thead>
          <tbody>{this.loadData()}</tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default Report;
