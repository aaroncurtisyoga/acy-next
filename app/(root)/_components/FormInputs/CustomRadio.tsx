import { Radio, cn } from "@heroui/react";

export const CustomRadio = (props) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center" +
            " justify-between",
          "flex-row-reverse cursor-pointer rounded-lg gap-4 border-2 border-transparent",
          "data-[selected=true]:border-primary w-full max-w-full",
        ),
      }}
    >
      {children}
    </Radio>
  );
};
