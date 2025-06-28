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
    // icon: 'fontawesome/solid/road',
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
        max: 15, // Enforce a maximum of 15 steps for total steps
      },
      bindable: true,
      hidden: (content, sidepanelContent) => sidepanelContent.stepSource && sidepanelContent.stepSource.is === 'bindable',
    },
    currentStep: {
      label: { en: "Current Step" },
      type: "Number",
      defaultValue: 0, // 0: Nothing done
      options: {
        min: 0, // Current step can start at 0
        // CORRECTED: Max value should dynamically match the 'totalSteps' value
        // (which is already capped at 15) or the bound stepNames length.
        max: (content, sidepanelContent) => {
          if (sidepanelContent.stepSource && sidepanelContent.stepSource.is === 'bindable' && Array.isArray(content.stepNames)) {
            // When bindable, the max is the actual length of the bound array (content.stepNames)
            // This will naturally be capped at 15 visually if the array is longer, but the editor should show the true length.
            return content.stepNames.length;
          }
          // When fixed, the max should be the value of 'totalSteps' from the sidepanel.
          // Use sidepanelContent.totalSteps for immediate reactivity with editor input.
          return sidepanelContent.totalSteps || 0; // Fallback to 0 if totalSteps isn't set yet
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