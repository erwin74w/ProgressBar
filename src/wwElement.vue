<template>
  <div class="ww-progress-indicator">
    <div class="progress-circle-container">
      <svg class="progress-ring" :width="circleSize" :height="circleSize">
        <circle
          class="progress-ring-bg"
          :r="radius"
          :cx="circleSize / 2"
          :cy="circleSize / 2"
        ></circle>
        <circle
          class="progress-ring-progress"
          :r="radius"
          :cx="circleSize / 2"
          :cy="circleSize / 2"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
        ></circle>
      </svg>
      <div class="progress-percentage">
        {{ percentageComplete }}%
      </div>
    </div>

    <div class="step-indicators-container">
      <div
        v-for="(stepName, index) in actualStepNames"
        :key="index"
        :class="['step-indicator', getStepStatus(index + 1)]"
        @mouseenter="showTooltip(stepName)"
        @mouseleave="hideTooltip"
        @click="handleStepClick(index + 1, stepName)"
      >
        {{ index + 1 }}
        <div v-if="tooltip.visible && tooltip.stepName === stepName" class="step-tooltip">
          {{ wwLib.wwLang.getText(stepName) }}
        </div>
      </div>
    </div>

    <div v-if="modal.visible" class="ww-modal-overlay" @click="closeModal">
      <div class="ww-modal-content" @click.stop>
        <h2>{{ wwLib.wwLang.getText(modal.title) }}</h2>
        <p>This is a modal for step {{ modal.stepNumber }}!</p>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // The 'content' prop holds all the editable data defined in ww-config.js
    content: {
      type: Object,
      required: true,
    },
    // WeWeb internal prop to trigger actions, typically named 'wwElement'
    wwElement: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      circleSize: 150, // Size of the SVG viewbox
      strokeWidth: 10, // Width of the progress ring
      tooltip: {
        visible: false,
        stepName: '',
      },
      modal: {
        visible: false,
        title: '',
        stepNumber: null,
      },
    };
  },
  computed: {
    // Calculate the radius of the circle
    radius() {
      return (this.circleSize - this.strokeWidth) / 2;
    },
    // Calculate the circumference of the circle
    circumference() {
      return 2 * Math.PI * this.radius;
    },
    // Calculate the stroke-dashoffset for the progress bar
    strokeDashoffset() {
      return this.circumference - (this.percentageComplete / 100) * this.circumference;
    },
    // Determine the actual step names to use, based on the stepSource
    actualStepNames() {
      // If stepSource is 'bindable', the stepNames array might be bound to something
      // so we use content.stepNames directly.
      // If stepSource is 'fixed', content.stepNames will be the array defined in ww-config.js.
      return Array.isArray(this.content.stepNames) ? this.content.stepNames : [];
    },
    // Determine the total number of steps based on the actualStepNames or totalSteps property
    currentTotalSteps() {
        if (this.content.stepSource && this.content.stepSource.is === 'bindable') {
            return this.actualStepNames.length;
        }
        return this.content.totalSteps || 1; // Fallback to 1 to prevent division by zero
    },
    // Calculate the percentage of completion for the progress circle
    percentageComplete() {
      if (this.currentTotalSteps === 0) return 0;
      // Calculate progress based on how many steps are completed.
      // Each step contributes (100 / totalSteps) to the progress.
      // Assuming 'currentStep' refers to the active step, all steps before it are completed.
      // So, if currentStep is 1, 0 steps are completed. If currentStep is 3, 2 steps are completed.
      const completedStepsCount = Math.max(0, this.content.currentStep - 1);
      return Math.round((completedStepsCount / this.currentTotalSteps) * 100);
    },
  },
  methods: {
    getStepStatus(stepNumber) {
      if (stepNumber < this.content.currentStep) {
        return 'completed'; // Green indicator
      } else if (stepNumber === this.content.currentStep) {
        return 'current'; // Green border
      } else {
        return 'unstarted'; // Grey border
      }
    },
    showTooltip(stepName) {
      this.tooltip.visible = true;
      this.tooltip.stepName = stepName;
    },
    hideTooltip() {
      this.tooltip.visible = false;
      this.tooltip.stepName = '';
    },
    handleStepClick(stepNumber, stepName) {
      // Only trigger the action if the step is completed
      if (stepNumber < this.content.currentStep) {
        // Emit the 'trigger:action' event with the name of the action property ('onStepClick')
        // and optionally pass data that WeWeb workflows can use.
        if (this.content.onStepClick) {
          this.$emit('trigger:action', {
            name: 'onStepClick',
            args: { stepNumber, stepName: wwLib.wwLang.getText(stepName) },
          });
        }
        // Open the modal for demonstration purposes
        this.openModal(stepNumber, stepName);
      }
    },
    openModal(stepNumber, stepName) {
      this.modal.visible = true;
      this.modal.title = `Step ${stepNumber}: ${stepName}`;
      this.modal.stepNumber = stepNumber;
    },
    closeModal() {
      this.modal.visible = false;
      this.modal.title = '';
      this.modal.stepNumber = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.ww-progress-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 20px;
  font-family: sans-serif;
}

/* Progress Circle Styling */
.progress-circle-container {
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-ring {
  transform: rotate(-90deg); /* Start the circle from the top */
  position: absolute;
}

.progress-ring-bg {
  stroke: #e0e0e0; /* Light grey background for the circle */
  stroke-width: 10px;
  fill: transparent;
}

.progress-ring-progress {
  stroke: #4CAF50; /* Green for the progress */
  stroke-width: 10px;
  fill: transparent;
  transition: stroke-dashoffset 0.35s; /* Smooth animation for progress */
}

.progress-percentage {
  position: absolute;
  font-size: 2em;
  font-weight: bold;
  color: #4CAF50;
}

/* Step Indicators Styling */
.step-indicators-container {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.step-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
  position: relative; /* For tooltip positioning */
  transition: all 0.3s ease; /* Smooth transitions for status changes */
}

.step-indicator.completed {
  background-color: #4CAF50; /* Green background */
  color: white;
  border: 2px solid #4CAF50;
}

.step-indicator.current {
  background-color: white;
  color: #4CAF50;
  border: 2px solid #4CAF50; /* Green border */
}

.step-indicator.unstarted {
  background-color: white;
  color: #a0a0a0;
  border: 2px solid #a0a0a0; /* Grey border */
}

.step-indicator:not(.completed):hover {
    background-color: #f0f0f0; /* Slight background change on hover for non-completed */
}

/* Tooltip Styling */
.step-tooltip {
  position: absolute;
  bottom: calc(100% + 5px); /* Position above the indicator */
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  white-space: nowrap;
  font-size: 0.9em;
  z-index: 10;
  pointer-events: none; /* Allows clicks to pass through to the step indicator */
}

/* Modal Styling */
.ww-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.ww-modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 90%;
  h2 {
    color: #333;
    margin-bottom: 15px;
  }
  p {
    color: #555;
    margin-bottom: 20px;
  }
  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    &:hover {
      background-color: #0056b3;
    }
  }
}
</style>