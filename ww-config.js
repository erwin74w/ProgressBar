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
        max: 15, // Enforce a maximum of 15 steps
      },
      bindable: true,
      hidden: (content, sidepanelContent) => sidepanelContent.stepSource && sidepanelContent.stepSource.is === 'bindable',
    },
    currentStep: {
      label: { en: "Current Step" },
      type: "Number",
      defaultValue: 1,
      options: {
        min: 1,
        // Dynamically set max for current step based on totalSteps or stepNames length
        max: (content, sidepanelContent) => {
          if (sidepanelContent.stepSource && sidepanelContent.stepSource.is === 'bindable' && Array.isArray(content.stepNames)) {
            return content.stepNames.length || 1; // Max is length of bound array, or 1 if empty
          }
          return content.totalSteps || 1; // Max is totalSteps, or 1 if not set
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