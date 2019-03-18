import React from 'react';
import Workbook from 'react-excel-workbook';

import api from '../api/api'
import Location from './Location';

class ProductDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: null,
            productInfo: null,
            addMode: false,
        }
    }

    componentDidMount() {
        api.get(`products/${this.props.match.params.id}`)
            .then(response => {
                this.setState({ product: response.data })
            });
        api.get(`products/${this.props.match.params.id}/locations`)
            .then(response => { this.setState({ productInfo: response.data }) });
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    toggle = () => {
        if (this.state.addMode) {
            this.reload();
        }
        this.setState(prevState => ({
            addMode: !prevState.addMode
        }))
    }

    reload = () => {
        api.get(`products/${this.props.match.params.id}/locations`)
            .then(
                response => {
                    this.setState({ productInfo: response.data, addMode: false })
                }
            );
    }

    newLocation = () => {
        if (this.state.addMode) {
            return (
                <Location
                    productId={this.props.match.params.id}
                    id={null}
                    reLoad={this.reload}
                />
            )
        }
    }

    loadDetail = () => {
        return this.state.productInfo.map(({ longitude, latitude, elevation, dateTime, id, ProductId }) => {
            return (
                <tr>
                    <Location
                        initialize={this.initialize}
                        productId={ProductId} id={id}
                        longitude={longitude} latitude={latitude}
                        elevation={elevation}
                        dateTime={new Date(dateTime).toLocaleString()}
                        reload={this.reload} />
                </tr>
            )
        })
    }

    exportExcel = () => {
        const { description } = this.state.product;
        let filename = `export_${description}.xlsx`;
        return (
            <React.Fragment>
                <Workbook filename={filename} element={<button className="ui teal button" style={{ position: "absolute", right: "0", marginRight: "1%" }}>Export</button>}>
                    <Workbook.Sheet data={this.state.productInfo} name={description}>
                        <Workbook.Column label="Longitude" value="longitude" />
                        <Workbook.Column label="Latitude" value="latitude" />
                        <Workbook.Column label="Elevation" value="elevation" />
                        <Workbook.Column label="DateTime" value="dateTime" />
                    </Workbook.Sheet>
                </Workbook>
            </React.Fragment>
        )
    }

    render() {
        if (!this.state.product || !this.state.productInfo) {
            return <h1>Loading...</h1>
        }
        const { id, description, createdAt } = this.state.product;
        return (
            <div>
                <div className="row text-center" style={{ marginLeft: "0.3%" }}>
                    <div className="ui huge header">Product</div>
                </div>
                <table className="ui fixed table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>CREATED</th>
                        </tr>
                    </thead>
                    <tbody>
                        <td>{id}</td>
                        <td>{description}</td>
                        <td>{new Date(createdAt).toLocaleString()}</td>
                    </tbody>
                </table>
                <br></br>
                <div className="row text-center" style={{ marginLeft: "0.3%" }}>
                    <div className="ui huge header">Location</div>
                    {this.exportExcel()}
                </div>
                <table className="ui fixed table">
                    <thead>
                        <tr>
                            <th>Longitude</th>
                            <th>Latitude</th>
                            <th>Elevation</th>
                            <th>DateTime</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.loadDetail()}
                        {this.newLocation()}
                    </tbody>
                </table>
                <button className="ui green button" onClick={this.toggle} style={{ marginLeft: "95%" }}>Add</button>
            </div>
        )
    }
}

export default ProductDetail;