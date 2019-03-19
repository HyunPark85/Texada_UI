import React from 'react';

import api from '../api/api';

class Products extends React.Component {
  state = {
    load: false,
    products: null,
    productInfo: null,
    targetId: null,
  };

  componentDidMount() {
    api.get('/products').then(response => {
      this.setState({ products: response.data });
    });
  }

  handleClick = ({ id }) =>
    api.get(`products/${id}/locations`).then(response => {
      this.setState({ productInfo: response.data, targetId: id });
    });

  handleDoubleClick = id =>
    this.props.history.push({ pathname: `/products/${id}/locations` });

  loadDetail = () => {
    if (this.state.productInfo) {
      return (
        <table className="ui celled table">
          <thead>
            <tr>
              <th>Longitude</th>
              <th>Latitude</th>
              <th>Elevation</th>
              <th>DateTime</th>
            </tr>
          </thead>
          <tbody>
            {this.state.productInfo.map(
              ({ longitude, latitude, elevation, dateTime }) => {
                return (
                  <tr>
                    <td>{new Number(longitude).toFixed(2)}</td>
                    <td>{new Number(latitude).toFixed(2)}</td>
                    <td>{elevation}</td>
                    <td>{new Date(dateTime).toLocaleString()}</td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      );
    }
    return '';
  };

  renderItems = () => {
    if (this.state.products) {
      return this.state.products.map(product => {
        const { id } = product;
        return (
          <tr>
            <td
              data-label="Name"
              onClick={() => this.handleClick(product)}
              onDoubleClick={() => this.handleDoubleClick(id)}
            >
              {id}
            </td>
            <td
              data-label="Name"
              onClick={() => this.handleClick(product)}
              onDoubleClick={() => this.handleDoubleClick(id)}
            >
              {product.description}
            </td>
            <td
              data-label="Age"
              onClick={() => this.handleClick(product)}
              onDoubleClick={() => this.handleDoubleClick(id)}
            >
              {new Date(product.createdAt).toLocaleString()}
            </td>
          </tr>
        );
      });
    }
    return <h1>Loading...</h1>;
  };

  render() {
    return (
      <div>
        <table className="ui celled table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>CREATED</th>
            </tr>
          </thead>
          <tbody>{this.renderItems()}</tbody>
        </table>
        {this.loadDetail()}
      </div>
    );
  }
}

export default Products;
