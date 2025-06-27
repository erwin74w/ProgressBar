// src/index.js

export default {
    // The render function is called by WeWeb whenever the component needs to be displayed or re-rendered
    // 'props' contains all the properties defined in ww-config.js
    render: function(props) {
      // Ensure totalSteps and currentStep are valid numbers
      const totalSteps = Math.max(1, parseInt(props.totalSteps) || 1); // At least 1 step
      const currentStep = Math.max(1, Math.min(totalSteps, parseInt(props.currentStep) || 1)); // Within valid range
  
      // Ensure stepNames is an array and has enough elements, or use a default
      const stepNames = Array.isArray(props.stepNames) ? props.stepNames : [];
  
      // --- Main Container (Flexbox for horizontal layout) ---
      const container = document.createElement('div');
      Object.assign(container.style, {
        display: 'flex',
        flexDirection: 'column', // Column layout for overall component
        alignItems: 'center',    // Center align items horizontally
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        gap: '20px', // Space between title, circle, and step indicators
      });
  
      // --- Title ---
      const title = document.createElement('h2');
      title.textContent = 'Workflow Progress';
      Object.assign(title.style, {
        margin: '0',
        color: '#333',
      });
      container.appendChild(title);
  
      // --- Subtitle (e.g., Step 4 of 5) ---
      const subtitle = document.createElement('p');
      subtitle.textContent = `Step ${currentStep} of ${totalSteps}`;
      Object.assign(subtitle.style, {
        margin: '0',
        color: '#666',
        fontSize: '0.9em',
      });
      container.appendChild(subtitle);
  
      // --- Circular Progress Bar ---
      const circleContainer = document.createElement('div');
      Object.assign(circleContainer.style, {
        position: 'relative',
        width: '150px', // Size of the circle
        height: '150px',
        borderRadius: '50%',
        backgroundColor: '#f0f0f0', // Background for the un-filled part
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Hide overflow from the pseudo-elements
      });
  
      const progress = (currentStep / totalSteps) * 100;
  
      // Create a pseudo-element effect for the circle using conic gradient
      const progressBarInner = document.createElement('div');
      Object.assign(progressBarInner.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        // Using a conic-gradient for accurate representation
        background: `conic-gradient(#4CAF50 ${progress}%, #e0e0e0 ${progress}%)`, // Green for filled, light grey for empty
      });
      circleContainer.appendChild(progressBarInner);
  
      // White circle in the middle to create the donut effect
      const innerCircle = document.createElement('div');
      Object.assign(innerCircle.style, {
        position: 'absolute',
        width: 'calc(100% - 20px)', // Smaller white circle (adjust as needed for border thickness)
        height: 'calc(100% - 20px)',
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1', // Ensure it's on top of the progress bar
      });
      circleContainer.appendChild(innerCircle);
  
      const percentageText = document.createElement('span');
      percentageText.textContent = `${Math.round(progress)}%`;
      Object.assign(percentageText.style, {
        fontSize: '2em',
        fontWeight: 'bold',
        color: '#4CAF50', // Green color for the percentage text
        zIndex: '2', // Ensure text is above everything
      });
      innerCircle.appendChild(percentageText); // Append percentage to inner white circle
      container.appendChild(circleContainer);
  
      // --- Step Indicators Container ---
      const stepsContainer = document.createElement('div');
      Object.assign(stepsContainer.style, {
        display: 'flex',
        justifyContent: 'center', // Center the steps horizontally
        gap: '15px', // Space between step circles
        marginTop: '20px',
      });
      container.appendChild(stepsContainer);
  
      // --- Create Individual Step Indicators ---
      for (let i = 1; i <= totalSteps; i++) {
        const stepEl = document.createElement('div');
        stepEl.textContent = i;
        Object.assign(stepEl.style, {
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          cursor: 'default', // Default cursor unless clickable
          position: 'relative', // For tooltip
          flexShrink: '0', // Prevent steps from shrinking on smaller screens
        });
  
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isUnstarted = i > currentStep;
  
        if (isCompleted) {
          Object.assign(stepEl.style, {
            backgroundColor: '#4CAF50', // Green background for completed
            color: 'white',
            cursor: 'pointer', // Clickable for completed steps
          });
          // Add event listener for completed steps
          stepEl.addEventListener('click', () => {
              // Check if the onStepClick action is defined in WeWeb and call it
              const stepName = stepNames[i - 1] || `Step ${i}`; // Fallback if name not found
              if (props.onStepClick && typeof props.onStepClick === 'function') {
                  // Call the WeWeb action, passing the stepName as a parameter
                  props.onStepClick({ stepName: stepName });
              }
          });
  
        } else if (isCurrent) {
          Object.assign(stepEl.style, {
            backgroundColor: 'white',
            color: '#4CAF50', // Green text for current
            border: '2px solid #4CAF50', // Green border for current
          });
        } else if (isUnstarted) {
          Object.assign(stepEl.style, {
            backgroundColor: 'white',
            color: '#888', // Grey text for unstarted
            border: '2px solid #ccc', // Grey border for unstarted
          });
        }
  
        // --- Tooltip (on hover) ---
        const stepName = stepNames[i - 1]; // Get the name for this step (adjust for 0-indexing)
        if (stepName) {
          stepEl.title = stepName; // Standard HTML title attribute for basic tooltip
        }
  
        stepsContainer.appendChild(stepEl);
      }
  
      return container; // Always return a DOM element
    },
  
    // You can also add other lifecycle hooks if needed:
    // onLoad: function() { console.log('Component loaded'); },
    // onPropsChanged: function(newProps, oldProps) { console.log('Props changed', newProps, oldProps); },
    // onUnload: function() { console.log('Component unloaded'); },
  };