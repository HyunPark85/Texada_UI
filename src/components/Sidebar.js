import React from 'react';

class Sidebar extends React.Component {
    render() {
        return (
            <div className="ui segment">
                {this.props.children}
            </div>
        )
    }
}

export default Sidebar;