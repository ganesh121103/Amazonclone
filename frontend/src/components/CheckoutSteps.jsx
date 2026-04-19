import { FaCheck } from 'react-icons/fa';

const steps = ['Cart', 'Shipping', 'Payment', 'Place Order'];

const CheckoutSteps = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 max-w-xl mx-auto">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                  ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-amazon text-amazon-blue-dark' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}
              >
                {isCompleted ? <FaCheck size={12} /> : stepNumber}
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-amazon' : isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mb-5 ${stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;
