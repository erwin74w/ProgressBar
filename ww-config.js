// ww-config.js
export default {
  id: 'ww-progress-indicator', // <--- IMPORTANT: Change this to a unique ID for your progress indicator!
  name: 'Workflow Progress Indicator',
  version: '1.0.0',
  src: 'src/wwElement.vue', // Make sure this points to your Vue component file
  category: 'custom',
  editor: {
    label: {
      en: "Workflow Progress Indicator", // This is what you'll see in the WeWeb Studio
    },
    // You can also add an icon:
    // icon: 'fontawesome/solid/road',
  },
  properties: {
    // Property to define the source of the step data (Fixed or Dynamic)
    // This allows the user to switch between directly entering step names
    // or binding them from a data source.
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
      defaultValue: { is: 'fixed' }, // Corrected: changed '=' to ':'
    },
    // Property for the total number of steps
    // We'll initially set this as a number, but later it can be derived from stepNames.length
    totalSteps: {
      label: { en: "Total Steps" },
      type: "Number",
      defaultValue: 5,
      bindable: true, // Allow this to be dynamically bound
      hidden: (content, sidepanelContent) => sidepanelContent.stepSource && sidepanelContent.stepSource.is === 'bindable',
    },
    // Property for the current active step
    currentStep: {
      label: { en: "Current Step" },
      type: "Number",
      defaultValue: 1,
      options: {
        min: 1,
        // The max value should ideally be tied to totalSteps or stepNames.length
        // For now, we'll keep it open, and handle validation in the Vue component if needed.
      },
      bindable: true, // Allow this to be dynamically bound
    },
    // Array to hold the names of each step for hover text and modal titles
    // This will be hidden when stepSource is 'bindable'
    stepNames: {
      label: { en: "Step Names" },
      type: "Array",
      options: {
        item: {
          type: "Text", // Each item in the array is a text string for the step name
        },
      },
      defaultValue: ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
      multiLang: true, // Allow translation for step names
      hidden: (content, sidepanelContent) => sidepanelContent.stepSource && sidepanelContent.stepSource.is === 'bindable',
    },
    // Property for the action to take when a completed step is clicked
    onStepClick: {
      label: { en: "On Completed Step Click" },
      type: "Action", // 'Action' type is used for events/workflows in WeWeb
      options: {
        isEvent: true, // Mark this as an event property
      },
    },
  },
};