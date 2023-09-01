import './App.css';
import AddItemForm from './AddItemForm/AddItemForm';
import DetailedReport from './DetailedReport/DetailedReport';
import Testing from './Testing/Testing';

function App() {
  return (
    <div className="host">
      <AddItemForm />
      <DetailedReport />
      <Testing />
    </div>
  );
}

export default App;
