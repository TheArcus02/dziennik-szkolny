import React from "react";
import { StepsProps } from "../../../utils/interfaces";

const Steps: React.FC<StepsProps> = ({ currentStep }) => {
  return (
    <ul className="hidden md:visible steps steps-vertical md:steps-horizontal transition-all duration-1000 ">
      <li
        className={`step  ${
          currentStep >= 1 && "step-primary cursor-pointer"
        } `}
      >
        Logowanie
      </li>
      <li
        className={`step  step-neutral ${
          currentStep >= 2 && "step-primary cursor-pointer"
        } `}
      >
        Dane
      </li>
      <li
        className={`step   step-neutral ${
          currentStep >= 3 && "step-primary cursor-pointer"
        } `}
      >
        Szkoła
      </li>
      <li
        className={`step   step-neutral ${
          currentStep >= 4 && "step-primary cursor-pointer"
        } `}
      >
        Plan
      </li>
      <li
        className={`step   step-neutral ${
          currentStep >= 5 && "step-primary cursor-pointer"
        } `}
      >
        Podsumowanie
      </li>
    </ul>
  );
};
export default Steps;
