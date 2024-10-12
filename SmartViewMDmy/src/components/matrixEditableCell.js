// https://cloudnweb.dev/2020/08/how-to-build-an-actionable-data-table-with-react-table-and-tailwindcss/
import React from "react";
import './MatrixEditableCell.css'

const MatrixEditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return   (    
    <div className="xfield">
      <input value={value} onChange={onChange} onBlur={onBlur} /> 
      </div>)
  ;
};

export default MatrixEditableCell;
