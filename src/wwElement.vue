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
          {{ getTranslatedText(stepName) }}
        </div>
      </div>
    </div>

    <div v-if="modal.visible" class="ww-modal-overlay" @click="closeModal">
      <div class="ww-modal-content" @click.stop>
        <h2>{{ getTranslatedText(modal.title) }}</h2>
        <p>This is a modal for step {{ modal.stepNumber }}!</p>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      required: true,
    },
    wwElement: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      circleSize: 150,
      strokeWidth: 10,
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
    radius() {
      return (this.circleSize - this.strokeWidth) / 2;
    },
    circumference() {
      return 2 * Math.PI * this.radius;
    },
    strokeDashoffset() {
      return this.circumference - (this.percentageComplete / 100) * this.circumference;
    },
    // Determine the actual step names to use, based on the stepSource
    actualStepNames() {
      // If stepSource is 'bindable', content.stepNames will be the bound array.
      // If stepSource is 'fixed', content.stepNames will be the array from ww-config.js (or default).
      // We also need to slice it to respect the totalSteps property in fixed mode.
      if (this.content.stepSource && this.content.stepSource.is === 'fixed') {
        const fixedNames = Array.isArray(this.content.stepNames) ? this.content.stepNames : [];
        // Slice the array to match the totalSteps, up to a maximum of 15 for display.
        // This ensures the visual number of steps aligns with totalSteps
        return fixedNames.slice(0, Math.min(this.content.totalSteps || 1, 15));
      }
      // For bindable, we still respect the 15 max, though the editor enforces it more directly.
      const bindableNames = Array.isArray(this.content.stepNames) ? this.content.stepNames : [];
      return bindableNames.slice(0, 15);
    },
    // Determine the total number of steps based on the actualStepNames or totalSteps property
    currentTotalSteps() {
        // When bindable, the total steps is the length of the *actual* bound array, up to 15.
        if (this.content.stepSource && this.content.stepSource.is === 'bindable') {
            return Math.min(this.actualStepNames.length, 15);
        }
        // When fixed, the total steps is content.totalSteps, up to 15.
        return Math.min(this.content.totalSteps || 1, 15);
    },
    percentageComplete() {
      if (this.currentTotalSteps === 0) return 0;
      const completedStepsCount = Math.max(0, this.content.currentStep - 1);
      return Math.round((completedStepsCount / this.currentTotalSteps) * 100);
    },
    wwLib() {
      return window.wwLib;
    },
  },
  methods: {
    getStepStatus(stepNumber) {
      if (stepNumber < this.content.currentStep) {
        return 'completed';
      } else if (stepNumber === this.content.currentStep) {
        return 'current';
      } else {
        return 'unstarted';
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
      if (stepNumber < this.content.currentStep) {
        if (this.content.onStepClick) {
          this.$emit('trigger:action', {
            name: 'onStepClick',
            args: { stepNumber, stepName: this.getTranslatedText(stepName) },
          });
        }
        this.openModal(stepNumber, stepName);
      }
    },
    openModal(stepNumber, stepName) {
      this.modal.visible = true;
      this.modal.title = `Step ${stepNumber}: ${this.getTranslatedText(stepName)}`;
      this.modal.stepNumber = stepNumber;
    },
    closeModal() {
      this.modal.visible = false;
      this.modal.title = '';
      this.modal.stepNumber = null;
    },
    getTranslatedText(text) {
      if (this.wwLib && this.wwLib.wwLang) {
        return this.wwLib.wwLang.getText(text);
      }
      return text;
    }
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
  flex-wrap: wrap; /* Allow items to wrap to the next line */
  justify-content: center; /* Center items in each row */
  gap: 15px;
  margin-top: 20px;
  max-width: calc(5 * 40px + 4 * 15px); /* (5 steps * 40px width) + (4 gaps * 15px) for 5 items per row */
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