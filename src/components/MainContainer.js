import React from 'react';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

class MainContainer extends React.Component{
    render(){
        return(
            <div className="ui container" style={{width:"90%", height:"80%"}}>
                <Navbar />
                <Sidebar>
                {this.props.children}
                </Sidebar>
            </div>
        )
    }
}

export default MainContainer;