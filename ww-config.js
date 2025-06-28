// ww-config.js
export default {
  id: 'ww-progress-indicator',
  name: 'Workflow Progress Indicator',
  version: '1.0.0',
  src: 'src/wwElement.vue',
  category: 'custom',
  editor: {
    label: {
      en: "Workflow Progress Indicator",
    },
  },
  properties: {
    stepSource: {
      label: { en: "Step Data Source" },
      type: "Object",
      options: {
        item: {
          type: "String",
          options: [
            { value: "fixed", label: "Fixed Steps" },
            { value: "bindable", label: "Dynamic Steps (Bindable)" },
          ],
        },
      },
      defaultValue: { is: 'fixed' },
    },
    totalSteps: {
      label: { en: "Total Steps" },
      type: "Number",
      defaultValue: 5,
      options: {
        min: 1,
        max: 15, // Max total steps is 15
      },
      bindable: true,
      hidden: (content, sidepanelContent) => sidepanelContent.stepSource && sidepanelContent.stepSource.is === 'bindable',
    },
    currentStep: {
      label: { en: "Current Step" },
      type: "Number",
      defaultValue: 0,
      options: {
        min: 0, // 0: Nothing done
        // CORRECTED: Max value should be the actual total number of steps (or length of stepNames).
        // The cap of 15 is already handled by totalSteps.
        max: (content, sidepanelContent) => {
          if (sidepanelContent.stepSource && sidepanelContent.stepSource.is === 'bindable' && Array.isArray(content.stepNames)) {
            // Max for bindable is the actual length of the bound array.
            // This will also indirectly be capped by the 15 steps visually shown if the array is longer.
            return content.stepNames.length;
          }
          // Max for fixed is content.totalSteps.
          return content.totalSteps || 0; // Use totalSteps, with 0 fallback
        },
      },
      bindable: true,
    },
    stepNames: {
      label: { en: "Step Names" },
      type: "Array",
      options: {
        item: {
          type: "Text",
        },
      },
      defaultValue: ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
      multiLang: true,
      hidden: (content, sidepanelContent) => sidepanelContent.stepSource && sidepanelContent.stepSource.is === 'bindable',
    },
    onStepClick: {
      label: { en: "On Completed Step Click" },
      type: "Action",
      options: {
        isEvent: true,
      },
    },
  },
};