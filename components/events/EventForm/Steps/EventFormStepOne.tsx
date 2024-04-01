import EndDatePickerInput from "@/components/events/EventForm/Fields/EndDatePickerInput";
import IsHostedExternallyCheckbox from "@/components/events/EventForm/Fields/IsHostedExternallyCheckbox";
import LocationInput from "@/components/events/EventForm/Fields/LocationInput";
import StartDatePickerInput from "@/components/events/EventForm/Fields/StartDatePickerInput";
import TitleInput from "@/components/events/EventForm/Fields/TitleInput";

const EventFormStepOne = ({ control, errors, isSubmitting, setValue }) => {
  return (
    <>
      <TitleInput
        control={control}
        isSubmitting={isSubmitting}
        errors={errors}
      />
      <LocationInput control={control} setValue={setValue} errors={errors} />
      <StartDatePickerInput
        control={control}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <EndDatePickerInput
        control={control}
        errors={errors}
        isSubmitting={isSubmitting}
      />
      <IsHostedExternallyCheckbox
        control={control}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default EventFormStepOne;
