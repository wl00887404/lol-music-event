import { ErrorMessage as BaseErrorMessage } from "formik";
import { Input as BaseInput } from "@/components/ui/input";
import { cn } from "@/libs/utils";
import type { ComponentPropsWithoutRef } from "react";

import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FieldName(props: ComponentPropsWithoutRef<"div">) {
  const { children, ...otherProps } = props;

  return (
    <div
      className="font-[500] text-[1.3125em] leading-[1] text-[#fff9e5]"
      {...otherProps}
    >
      {children}
    </div>
  );
}

function InputContainer(props: { children: React.ReactNode }) {
  return (
    <div className="relative mt-[0.5em]">
      <div className="flex pointer-events-none">
        <img src="/icons/dialog-input-bg.png" className="w-[0.625em] h-[3em]" />
        <div className="flex-1 bg-[#fff9e5]" />
        <img
          src="/icons/dialog-input-bg.png"
          className="w-[0.625em] h-[3em] rotate-180"
        />
      </div>
      <div className="w-full h-[3em] absolute top-0 left-0">
        {props.children}
      </div>
    </div>
  );
}

const textClassName =
  "font-[500] !text-[1.3125em] !leading-[2.2857142857142857143em] text-[#0b1527]";

export function Input(props: React.ComponentProps<typeof BaseInput>) {
  return (
    <InputContainer>
      <BaseInput
        className={cn(
          "border-none rounded-none py-0 px-[1em]  h-auto",
          textClassName,
        )}
        {...props}
      />
    </InputContainer>
  );
}

export function ErrorMessage(
  props: React.ComponentProps<typeof BaseErrorMessage>,
) {
  return (
    <div className="my-[0.4375em]">
      <div className="text-[#FF4655] text-[0.8125em] leading-[1] font-[500]">
        <BaseErrorMessage {...props} />
        &nbsp;
      </div>
    </div>
  );
}

export type Item = { value: string; label: string };

type SelectProps = React.ComponentProps<typeof BaseSelect> & {
  options: Item[];
  placeholder?: string;
};

export function Select(props: SelectProps) {
  const { options, placeholder, ...otherProps } = props;

  const items = options.map((option) => {
    return (
      <SelectItem
        className={textClassName}
        key={option.value}
        value={option.value}
      >
        {option.label}
      </SelectItem>
    );
  });

  return (
    <InputContainer>
      <BaseSelect {...otherProps}>
        <SelectTrigger
          className={cn(
            textClassName,
            "bg-[transparent] text-[#0b1527] w-full",
            "flex items-center py-0 !px-[1em] !h-[2.2857142857142857143em] border-none",
          )}
          icon={
            <img
              src="/icons/chevron-down.png"
              className="w-[1.3333333333333333333em] aspect-ratio-[1/1]"
            />
          }
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{items}</SelectContent>
      </BaseSelect>
    </InputContainer>
  );
}
