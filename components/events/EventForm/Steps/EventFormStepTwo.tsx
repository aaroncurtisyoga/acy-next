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
}) => {
  return (
    <div>
      {isHostedExternally ? (
        <div className={"grid grid-cols-2 gap-5"}>
          <ExternalRegistrationUrlInput
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
          />
          <Category
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <>
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
          </div>
          <div className={"grid grid-cols-1 gap-5 my-5"}>
            <DescriptionRichTextEditor control={control} errors={errors} />
            <ImagePicker errors={errors} setValue={setValue} />
          </div>
        </>
      )}
    </div>
  );
};

export default EventFormStepTwo;
