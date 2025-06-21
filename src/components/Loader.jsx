import React from 'react';

const Loader = ({ message }) => (
  <div className="flex justify-center items-center h-[50vh]">
    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
    <p className="absolute text-lg font-semibold mt-36">{message || 'Loading...'}</p>
  </div>
);

export default Loader;
