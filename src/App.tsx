import * as React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from './store'
import './App.css';
import { MyNavBar, HomePage, LasPage } from './components';

const store = configureStore();
class App extends React.Component {
   render() {
      return (
         <Provider store={store}>
            <Router>
               <div className="App">
                  <MyNavBar />
                  <Route path="/" exact component={HomePage} />
                  <Route path="/las" exact component={LasPage} />
               </div>
            </Router>
         </Provider>
      );
   }
}
export default App;
