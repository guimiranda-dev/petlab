import {
  Autocomplete as AutocompleteHero,
  AutocompleteItem,
  AutocompleteProps,
} from '@heroui/autocomplete';
import React from 'react';
import { Key } from 'react';

interface AutocompleteItemType {
  label: string;
  key: string;
}

export interface ISelect
  extends Omit<AutocompleteProps<AutocompleteItemType>, 'selectedKey' | 'children'> {
  label?: string;
  containerClassName?: string;
  className?: string;
  placeholder?: string;
  isLoading?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  onInputChange: (v: string) => void;
  onSelectionChange: (key: Key | null) => void;
  inputValue: string;
  selectedKey: Key | null;
  defaultItems: AutocompleteItemType[];
}

type FieldState = {
  selectedKey: React.Key | null;
  inputValue: string;
};

export type AutocompleteRef = {
  clear: () => void;
  setValue: (key: React.Key | null, inputValue?: string) => void;
};

const Autocomplete = React.forwardRef<AutocompleteRef, ISelect>((props, ref) => {
  const [fieldState, setFieldState] = React.useState<FieldState>({
    selectedKey: props.selectedKey || '',
    inputValue: props.inputValue || '',
  });

  React.useImperativeHandle(
    ref,
    () => ({
      clear: () => {
        setFieldState({
          selectedKey: null,
          inputValue: '',
        });
        // Notificar o componente pai sobre a mudança
        props.onSelectionChange?.(null);
        props.onInputChange?.('');
      },
      setValue: (key: React.Key | null, inputValue?: string) => {
        const selectedItem = props.defaultItems.find((option) => option.key === key);
        const newInputValue = inputValue || selectedItem?.label || '';

        setFieldState({
          selectedKey: key,
          inputValue: newInputValue,
        });

        // Notificar o componente pai sobre a mudança
        props.onSelectionChange?.(key);
        props.onInputChange?.(newInputValue);
      },
    }),
    [props.defaultItems, props.onSelectionChange, props.onInputChange],
  );

  const onSelectionChange = (key: React.Key | null) => {
    props.onSelectionChange(key);
    setFieldState((prevState) => {
      let selectedItem = props.defaultItems.find((option) => option.key === key);

      return {
        inputValue: selectedItem?.label || '',
        selectedKey: key,
      };
    });
  };

  const onInputChange = (value: string) => {
    props.onInputChange(value);
    setFieldState((prevState) => ({
      inputValue: value,
      selectedKey: value === '' ? null : prevState.selectedKey,
    }));
  };

  return (
    <div>
      <div className={`${props.containerClassName} w-full`}>
        <AutocompleteHero
          {...props}
          defaultItems={props.defaultItems}
          inputValue={fieldState.inputValue}
          selectedKey={fieldState.selectedKey as string}
          onInputChange={onInputChange}
          onSelectionChange={onSelectionChange}
          inputMode='search'
          aria-label={props.label}
          aria-hidden={false}
          isLoading={props.isLoading}
          isInvalid={props.isInvalid}
          errorMessage={props.errorMessage}
        >
          {(item: AutocompleteItemType) => (
            <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
          )}
        </AutocompleteHero>
      </div>
    </div>
  );
});

Autocomplete.displayName = 'Autocomplete';
export default Autocomplete;
