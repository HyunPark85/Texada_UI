import React from 'react';
import api from '../api/api';

import LocationEdit from './LocationEdit';

class Location extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productInfo: null,
            inputVisible: false,
            id: this.props.id,
        }
    }

    componentDidMount() {
        if (this.state.id) {
            api.get(`/products/${this.props.productId}/locations/${this.state.id}`)
                .then(response => {
                    this.setState({ productInfo: response.data })
                });
        }
        else {
            this.setState({ inputVisible: true });
        }
    }

    toggle = (id, update = false) => {
        this.setState(prevState => ({
            inputVisible: !prevState.inputVisible
        }))

        if (!update)
            return;

        this.setState({ id: id });
        api.get(`/products/${this.props.productId}/locations/${this.state.id}`)
            .then(response => {
                this.setState({ productInfo: response.data });
            });
    }

    loadData = () => {
        if (this.state.productInfo) {
            let { id, longitude, latitude, elevation, dateTime } = this.state.productInfo[0];
            return (
                <React.Fragment>
                    <td>{new Number(longitude).toFixed(2)}</td>
                    <td>{new Number(latitude).toFixed(2)}</td>
                    <td>{elevation}</td>
                    <td>{new Date(dateTime).toLocaleString()}</td>
                </React.Fragment>
            )
        }
    }

    handleDelete = () => {
        api.delete(`/products/${this.props.productId}/locations/${this.state.id}`)
            .then(() => {
                this.props.reload();
            })
    }

    render() {
        if (this.state.inputVisible) {
            return (
                <LocationEdit
                    toggle={this.toggle}
                    productId={this.props.productId}
                    productInfo={this.state.productInfo} />
            )
        }
        return (
            <React.Fragment>
                {this.loadData()}
                <td>
                    <button onClick={this.toggle} className="ui blue button">Edit</button>
                    <button onClick={this.handleDelete} className="ui red button">Delete</button>
                </td>
            </React.Fragment>
        )
    }
}

export default Location;