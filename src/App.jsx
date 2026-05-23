import React, { useState } from 'react';
import OrderForm from './Components/OrderForm';
import RunnerDashboard from './Components/RunnerDashboard';

function App() {
  const [view, setView] = useState('client'); 

  return (
    <div className="App" style={{ padding: '20px' }}>
      

      {view === 'client' ? <OrderForm /> : <RunnerDashboard runnerProfile={{id: 'test_runner_1'}} />}
    </div>
  );
}

export default App;