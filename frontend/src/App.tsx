import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Welcome } from './pages/Welcome';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Chat } from './pages/Chat';
import { Vitals } from './pages/Vitals';
import { Reminders } from './pages/Reminders';

function ApiTest() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the Flask backend
    fetch('http://localhost:5000/api/data')
      .then((response) => response.json())
      .then((data) => setData(data.message))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <Layout>
      <div>
        <h1>API Test Page</h1>
        {data ? <p>{data}</p> : <p>Loading...</p>}
      </div>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Welcome page without layout */}
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        
        {/* Pages with layout */}
        <Route path="/home" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/chat" element={
          <Layout>
            <Chat />
          </Layout>
        } />
        <Route path="/vitals" element={
          <Layout>
            <Vitals />
          </Layout>
        } />
        <Route path="/reminders" element={
          <Layout>
            <Reminders />
          </Layout>
        } />

        {/* New route for API test */}
        <Route path="/api-test" element={<ApiTest />} />
      </Routes>
    </Router>
  );
}

export default App;