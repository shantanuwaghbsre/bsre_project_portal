import React from "react";
import "./MultiStepProgressBar.css";
import { ProgressBar, Step } from "react-step-progress-bar";

const MultiStepProgressBar = ({ page, onPageNumberClick,project_in_phase }) => {
  var stepPercentage = 0;
  stepPercentage = (page * 100) / 10;
  // stepPercentage = page * 10;
  console.log(page, stepPercentage);

  return (
    <ProgressBar percent={stepPercentage}>
      {Array.from({ length: 10 }, (_, index) => (
              <Step>
              {({ accomplished }) => (
                <div key={index}
                  className={`indexedStep ${accomplished ? "accomplished" : null}`}
                  onClick={() =>{if(index < project_in_phase - 1) {onPageNumberClick(index + 1 );}else if(index == project_in_phase - 1) {onPageNumberClick(index + 1 );}}}
                  // onClick={() =>{onPageNumberClick(index + 1)}}
                >
                  {index + 1}
                </div>
              )}
            </Step>
            ))}
      {/* <Step>
        {({ accomplished, index }) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null}`}
            onClick={() => onPageNumberClick("1")}
          >
            {index + 1}
          </div>
        )}
      </Step>
      */}
    </ProgressBar>
  );
};

export default MultiStepProgressBar;
