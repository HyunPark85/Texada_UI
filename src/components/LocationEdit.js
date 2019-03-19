import React from 'react';
import api from '../api/api';

class LocationEdit extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.productInfo == null) {
      this.state = {
        id: '',
        longitude: '',
        latitude: '',
        elevation: '',
        dateTime: new Date(),
        editMode: false,
        productId: this.props.productId,
      };
    } else {
      const {
        longitude,
        latitude,
        elevation,
        dateTime,
        id,
      } = this.props.productInfo[0];
      this.state = {
        id,
        longitude,
        latitude,
        elevation,
        dateTime: new Date(dateTime),
        productId: this.props.productId,
        editMode: true,
      };
    }
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSave = () => {
    const {
      id,
      dateTime,
      longitude,
      latitude,
      elevation,
    } = this.state;
    //TODO: Validation logic
    let obj = {
      id: id,
      dateTime: new Date(dateTime),
      longitude: longitude,
      latitude: latitude,
      elevation: elevation,
    };

    if (this.state.editMode) {
      api
        .put(`/products/${this.state.productId}/locations/${obj.id}`, obj)
        .then(response => {
          this.props.toggle(obj.id, true);
        });
    } else {
      api
        .post(`products/${this.state.productId}/locations`, obj)
        .then(response => {
          this.props.toggle(response.data.id, true);
        });
    }
  };

  handleDelete = () => {
    const { id, productId } = this.state;

    this.props.handleDelete(productId, id);
    this.props.toggle(null);
  };

  toDatetimeLocal = datetime => {
    if (!datetime) {
      return;
    }
    let date = new Date(datetime),
      ten = function (i) {
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

  render() {
    return (
      <React.Fragment>
        <td>
          <div className="ui input">
            <input
              onChange={this.handleChange}
              value={this.state.longitude}
              type="text"
              name="longitude"
              placeholder="Enter Longitude.."
            />
          </div>
        </td>
        <td>
          <div className="ui input">
            <input
              onChange={this.handleChange}
              type="text"
              value={this.state.latitude}
              name="latitude"
              placeholder="Enter Latitude.."
            />
          </div>
        </td>
        <td>
          <div className="ui input">
            <input
              onChange={this.handleChange}
              type="text"
              value={this.state.elevation}
              name="elevation"
              placeholder="Enter Elevation.."
            />
          </div>
        </td>
        <td>
          <div className="ui input">
            <input
              onChange={this.handleChange}
              type="datetime-local"
              value={this.toDatetimeLocal(this.state.dateTime)}
              name="dateTime"
            />
          </div>
        </td>
        <td>
          <button
            onClick={this.handleSave}
            className="ui green button"
            type="submit"
          >
            Save
          </button>
          <button onClick={this.props.toggle} className="ui red button">
            Cancel
          </button>
        </td>
      </React.Fragment>
    );
  }
}

export default LocationEdit;
