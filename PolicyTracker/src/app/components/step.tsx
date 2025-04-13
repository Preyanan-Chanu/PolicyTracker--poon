import React from "react";

interface StepProps {
    step: number;
    label: string;
    bgColor: string;
  }
  
  const Step: React.FC<StepProps> = ({ step, label, bgColor }) => {
    return (
      <div className="flex items-center h-[40px] max-w-[150px] rounded-full px-2" style={{ backgroundColor: bgColor }}>
        <h3 className="bg-white text-center h-[30px] w-[30px] rounded-[50%] text-[1.5rem] m-0">{step}</h3>
        <p className="text-white text-center text-[1rem] mx-2 my-auto">{label}</p>
      </div>
    );
  };
  
  export default Step;
  
