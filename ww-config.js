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
        max: 15, // Enforce a maximum of 15 steps
      },
      bindable: true,
      hidden: (content, sidepanelContent) => sidepanelContent.stepSource && sidepanelContent.stepSource.is === 'bindable',
    },
    currentStep: {
      label: { en: "Current Step" },
      type: "Number",
      defaultValue: 0, // Changed to 0
      options: {
        min: 0, // Changed to 0: Nothing done
        max: (content, sidepanelContent) => {
          if (sidepanelContent.stepSource && sidepanelContent.stepSource.is === 'bindable' && Array.isArray(content.stepNames)) {
            // Max is length of bound array (all steps completed), or 0 if empty
            return content.stepNames.length || 0;
          }
          // Max is totalSteps (all steps completed), or 0 if not set
          return content.totalSteps || 0;
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