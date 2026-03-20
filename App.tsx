import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Editor from './pages/Editor';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
