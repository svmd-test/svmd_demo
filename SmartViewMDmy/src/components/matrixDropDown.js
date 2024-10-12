import React, { useState } from "react";
import './MatrixDropDown.css'

{/* <label>
Gender
<select className="gender" name="gender" ref={register} placeHolder="Optional" >
  <option value="">Optional</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
</select>
</label> */}

const MatrixDropDown = ({ title, options, selectedValue, onItemClick }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <div>
        <span className="rounded-md shadow-sm">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-1 py-1 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
            id="options-menu"
            onClick={() => setOpen(!isOpen)}
            aria-haspopup="true"
            aria-expanded="true"
          >

            <div>{selectedValue ? selectedValue : title}
              <span className="svg-inline">

                <svg
                  className="classNameSVG"
                  viewBox="0 0 40 20"
                  fill="currentColor"
                >
                  <path
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  />

                </svg>
              </span>
            </div>
          </button>
        </span>
      </div>
      {isOpen ? (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg">
          <div className="rounded-md bg-white shadow-xs">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {options.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="block px-2 py-1 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                    onClick={() => onItemClick(item.value)}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MatrixDropDown;