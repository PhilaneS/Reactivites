import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers'
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form'

type Props<T extends FieldValues> =
    UseControllerProps<T> & Omit<DateTimePickerProps, 'value' | 'onChange'>


export default function DateTimeInput<T extends FieldValues>(props: Props<T>) {
    //const { control, name, rules, defaultValue, shouldUnregister, ...pickerProps } = props;
    const { field, fieldState } = useController({ ...props });

    return (
        <DateTimePicker
            {...props}
            value={field.value ? new Date(field.value) : null}
            onChange={(value) => field.onChange(new Date(value!))}
            sx={{ width: '100%' }}
            slotProps={{
                textField: {
                    //fullWidth: true,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                    onBlur: field.onBlur,
                    //inputRef: field.ref,
                },
            }}
        />
    )
}