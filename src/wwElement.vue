<template>
  <div :style="containerStyle">
    <h2>Workflow Progress</h2>
    <p>Step {{ currentStepComputed }} of {{ totalStepsComputed }}</p>

    <div :style="circleContainerStyle">
      <div :style="progressBarInnerStyle"></div>
      <div :style="innerCircleStyle">
        <span :style="percentageTextStyle">{{ Math.round(progressPercentage) }}%</span>
      </div>
    </div>

    <div :style="stepsContainerStyle">
      <div
        v-for="i in totalStepsComputed"
        :key="i"
        :style="getStepElementStyle(i)"
        :title="getStepName(i)"
        @click="handleStepClick(i)"
      >
        {{ i }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // WeWeb passes properties from ww-config.js into the 'content' prop for Vue components
  // The 'content' prop is an object where keys are your defined properties.
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        totalSteps: 5,
        currentStep: 1,
        stepNames: ["Introduction", "Details", "Confirmation", "Review", "Completion"],
      }),
    },
    // WeWeb actions are often passed as separate function props
    onStepClick: {
      type: Function,
      default: () => {}, // Provide a default empty function
    }
  },
  computed: {
    // Sanitize and compute totalSteps
    totalStepsComputed() {
      return Math.max(1, parseInt(this.content.totalSteps) || 1);
    },
    // Sanitize and compute currentStep
    currentStepComputed() {
      const total = this.totalStepsComputed;
      return Math.max(1, Math.min(total, parseInt(this.content.currentStep) || 1));
    },
    // Calculate progress percentage for the circular bar
    progressPercentage() {
      return (this.currentStepComputed / this.totalStepsComputed) * 100;
    },
    // General container styles
    containerStyle() {
      return {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba="rgba(0,0,0,0.1)", // Note: Fixed the extra quote here if you copied it exactly
        gap: '20px',
      };
    },
    // Circular progress bar container styles
    circleContainerStyle() {
      return {
        position: 'relative',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      };
    },
    // Inner progress bar (filled part) styles
    progressBarInnerStyle() {
      return {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: `conic-gradient(#4CAF50 ${this.progressPercentage}%, #e0e0e0 ${this.progressPercentage}%)`,
      };
    },
    // White inner circle styles (to create donut)
    innerCircleStyle() {
      return {
        position: 'absolute',
        width: 'calc(100% - 20px)',
        height: 'calc(100% - 20px)',
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1',
      };
    },
    // Percentage text style
    percentageTextStyle() {
      return {
        fontSize: '2em',
        fontWeight: 'bold',
        color: '#4CAF50',
        zIndex: '2',
      };
    },
    // Styles for the container holding all step circles
    stepsContainerStyle() {
      return {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginTop: '20px',
      };
    },
  },
  methods: {
    // Method to compute styles for individual step elements
    getStepElementStyle(stepNumber) {
      const isCompleted = stepNumber < this.currentStepComputed;
      const isCurrent = stepNumber === this.currentStepComputed;
      const isUnstarted = stepNumber > this.currentStepComputed;

      let style = {
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        cursor: 'default',
        position: 'relative',
        flexShrink: '0',
      };

      if (isCompleted) {
        style = {
          ...style, // Spread existing styles
          backgroundColor: '#4CAF50',
          color: 'white',
          cursor: 'pointer',
        };
      } else if (isCurrent) {
        style = {
          ...style,
          backgroundColor: 'white',
          color: '#4CAF50',
          border: '2px solid #4CAF50',
        };
      } else if (isUnstarted) {
        style = {
          ...style,
          backgroundColor: 'white',
          color: '#888',
          border: '2px solid #ccc',
        };
      }
      return style;
    },
    // Get step name for tooltip
    getStepName(stepNumber) {
      // Ensure stepNames is an array and has enough elements
      const stepNamesArray = Array.isArray(this.content.stepNames) ? this.content.stepNames : [];
      return stepNamesArray[stepNumber - 1] || `Step ${stepNumber}`;
    },
    // Handle click on a completed step
    handleStepClick(stepNumber) {
      const isCompleted = stepNumber < this.currentStepComputed;
      if (isCompleted) {
        const stepName = this.getStepName(stepNumber);
        // Call the WeWeb action if it's defined
        if (this.onStepClick && typeof this.onStepClick === 'function') {
          // WeWeb actions are triggered by calling the prop function with parameters
          this.onStepClick({ stepName: stepName });
          // Per your requirement, open a "Hello World" modal here
          // WeWeb provides a global object 'wwLib' for such actions in the Studio context
          wwLib.openPopup({
            title: stepName, // Use the step name as the title
            content: 'Hello world from WeWeb!',
            size: 'md', // You can set size to sm, md, lg, xl
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* All styles are handled via inline style bindings in the template and script. */
/* No CSS rules are needed here at the moment, so this block can remain empty or be removed if preferred. */
</style>