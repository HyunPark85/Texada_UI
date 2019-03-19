import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Products from './Products';
import ProductDetail from './ProductDetail';
import MainContainer from './MainContainer';
import Report from './Report';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <MainContainer>
            <Route exact path="/" component={Products} />
            <Route
              exact
              path="/products/:id/locations"
              component={ProductDetail}
            />
            <Route exact path="/reports" component={Report} />
          </MainContainer>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
