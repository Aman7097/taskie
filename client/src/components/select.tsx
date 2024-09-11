import React from "react";
import Select, { SingleValue } from "react-select";

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder,
  onChange,
  controlClasses,
  value,
}) => {
  const handleChange = (selectedOption: SingleValue<OptionType>) => {
    onChange(selectedOption);
  };

  return (
    <Select<OptionType>
      options={options}
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
      className="w-full"
      classNamePrefix="react-select"
      classNames={{
        placeholder: () => "overflow-hidden text-sm line-clamp-1 text-ellipsis",
        control: (state) =>
          `w-36 rounded-lg text-sm text-secondary border-gray  focus:border-gray-500 ${
            state.menuIsOpen
              ? "rounded-bl-none rounded-br-none shadow-none"
              : ""
          } ${controlClasses}`,
        menu: () => "p-0 text-sm shadow-button rounded-br-lg rounded-bl-lg",
        option: () => "text-secondary cursor-pointer",
      }}
      isSearchable={false}
    />
  );
};

CustomSelect.displayName = "Select";

export default CustomSelect;
