import { Button } from "@nextui-org/react";
import Category from "@/components/events/EventForm/Fields/Category";
import DescriptionRichTextEditor from "@/components/events/EventForm/Fields/DescriptionRichTextEditor";
import ExternalRegistrationUrlInput from "@/components/events/EventForm/Fields/ExternalRegistrationUrlInput";
import ImagePicker from "@/components/events/EventForm/Fields/ImagePicker";
import PriceInput from "@/components/events/EventForm/Fields/PriceInput";

const EventFormStepTwo = ({
  isHostedExternally,
  control,
  errors,
  isSubmitting,
  setValue,
  type,
}) => {
  return (
    <div>
      {isHostedExternally ? (
        <ExternalRegistrationUrlInput
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
        />
      ) : (
        <div className={"grid grid-cols-2 gap-5"}>
          <Category
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
          />
          <PriceInput
            control={control}
            isSubmitting={isSubmitting}
            errors={errors}
          />
          <ImagePicker errors={errors} setValue={setValue} />
          <DescriptionRichTextEditor
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
          />
          <Button color={"primary"} type="submit" className={"w-full"}>
            {type} Event
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventFormStepTwo;
