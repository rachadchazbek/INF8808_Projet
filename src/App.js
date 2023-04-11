import './App.css';
import CenteredTabs from './pages/main';


function App(routes) {
  return (
    <div className="App">
      <h1>Le coeur a ses raisons</h1>
      {/* <Router>
        <Route exact path="/" component={LifeHabitsPage} />
        <Route path="/physique" component={PhysicalHabitsPage} />
        <Route path="/metabolisme" component={MetabolismePage} />
      </Router> */}
      <CenteredTabs>

      </CenteredTabs>

    </div>
  );
}

export default App;
