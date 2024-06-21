import React from "react";
import "./MultiStepProgressBar.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { dividerClasses } from "@mui/material";

const MultiStepProgressBar = ({ page, onPageNumberClick, project_in_phase }) => {
  var stepPercentage = 0;
  stepPercentage = (page * 100) / 10;

  return (
          <div style={{ padding: '0 5%' }}>
            <ProgressBar percent={stepPercentage}>
              {Array.from({ length: 10 }, (_, index) => (
                <Step key={index}>
                  {({ accomplished }) => (
                    <div key={index}
                      className={`indexedStep ${accomplished ? "accomplished" : null}`}
                      onClick={() => { if (index < project_in_phase - 1) { onPageNumberClick(index + 1); } else if (index == project_in_phase - 1) { onPageNumberClick(index + 1); } }}
                    >
                      {index + 1}
                    </div>
                  )}
                </Step>
              ))}
            </ProgressBar>
          </div>
  );
};

export default MultiStepProgressBar;
