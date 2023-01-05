import { Routes, Route } from 'react-router-dom';
import * as View from './view'


function App() {
  return (
    <>
    <View.Header />
    <Routes>
      <Route path='/exchange' element={<View.Homepage />}></Route>
      <Route path='/admin' element={<View.Admin />}></Route>
      <Route path='/' element={<View.Homepage />}></Route>
    </Routes>
    </>
  );
}

export default App;
