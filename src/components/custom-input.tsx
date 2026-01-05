import type { Control, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

import { Checkbox } from './ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

// Generic input props
interface BaseInputProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
}

interface TextInputProps<T extends FieldValues> extends BaseInputProps<T> {
    type: 'input';
    inputType?: 'text' | 'email' | 'password' | 'date' | 'number' | 'tel' | 'time' | 'url';
    min?: number;
    max?: number;
}

interface SelectInputProps<T extends FieldValues> extends BaseInputProps<T> {
    type: 'select';
    selectList: { label: string; value: string }[];
}

interface CheckboxInputProps<T extends FieldValues> extends BaseInputProps<T> {
    type: 'checkbox';
    description?: string;
}

interface RadioInputProps<T extends FieldValues> extends BaseInputProps<T> {
    type: 'radio';
    selectList: { label: string; value: string }[];
    defaultValue?: string;
    orientation?: 'horizontal' | 'vertical';
}

interface TextareaInputProps<T extends FieldValues> extends BaseInputProps<T> {
    type: 'textarea';
    rows?: number;
}

interface SwitchInputProps<T extends FieldValues> extends BaseInputProps<T> {
    type: 'switch';
    description?: string;
}

// Union type for all input variants
type InputProps<T extends FieldValues> =
    | TextInputProps<T>
    | SelectInputProps<T>
    | CheckboxInputProps<T>
    | RadioInputProps<T>
    | TextareaInputProps<T>
    | SwitchInputProps<T>;

// Helper to check if props are of specific type
function isTextInput<T extends FieldValues>(props: InputProps<T>): props is TextInputProps<T> {
    return props.type === 'input';
}

function isSelectInput<T extends FieldValues>(props: InputProps<T>): props is SelectInputProps<T> {
    return props.type === 'select';
}

function isCheckboxInput<T extends FieldValues>(props: InputProps<T>): props is CheckboxInputProps<T> {
    return props.type === 'checkbox';
}

function isRadioInput<T extends FieldValues>(props: InputProps<T>): props is RadioInputProps<T> {
    return props.type === 'radio';
}

function isTextareaInput<T extends FieldValues>(props: InputProps<T>): props is TextareaInputProps<T> {
    return props.type === 'textarea';
}

function isSwitchInput<T extends FieldValues>(props: InputProps<T>): props is SwitchInputProps<T> {
    return props.type === 'switch';
}

// Render input component with proper typing
const RenderInput = <T extends FieldValues>({
    field,
    props
}: {
    field: ControllerRenderProps<T, Path<T>>;
    props: InputProps<T>;
}) => {
    if (isTextInput(props)) {
        return (
            <FormControl>
                <Input
                    disabled={props.disabled}
                    max={props.max}
                    min={props.min}
                    placeholder={props.placeholder}
                    required={props.required}
                    type={props.inputType || 'text'}
                    {...field}
                />
            </FormControl>
        );
    }

    if (isSelectInput(props)) {
        return (
            <Select
                disabled={props.disabled}
                onValueChange={field.onChange}
                required={props.required}
                value={field.value as string}
            >
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder={props.placeholder} />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {props.selectList.map(item => (
                        <SelectItem
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    if (isCheckboxInput(props)) {
        return (
            <div className='items-top flex space-x-2'>
                <Checkbox
                    checked={field.value as boolean}
                    disabled={props.disabled}
                    id={props.name as string}
                    onCheckedChange={field.onChange}
                    required={props.required}
                />
                <div className='grid gap-1.5 leading-none'>
                    <Label
                        className='cursor-pointer font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        htmlFor={props.name as string}
                    >
                        {props.label}
                    </Label>
                    {props.description && <p className='text-muted-foreground text-sm'>{props.description}</p>}
                </div>
            </div>
        );
    }

    if (isRadioInput(props)) {
        return (
            <div className='w-full'>
                <FormLabel>{props.label}</FormLabel>
                <RadioGroup
                    className={`flex ${props.orientation === 'vertical' ? 'flex-col' : 'gap-4'} gap-2`}
                    disabled={props.disabled}
                    onValueChange={field.onChange}
                    required={props.required}
                    value={field.value as string}
                >
                    {props.selectList.map(item => (
                        <div
                            className='flex w-full items-center'
                            key={item.value}
                        >
                            <RadioGroupItem
                                className='peer sr-only'
                                id={`${props.name}-${item.value}`}
                                value={item.value}
                            />
                            <Label
                                className='flex flex-1 items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:text-blue-600'
                                htmlFor={`${props.name}-${item.value}`}
                            >
                                {item.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        );
    }

    if (isTextareaInput(props)) {
        return (
            <FormControl>
                <Textarea
                    disabled={props.disabled}
                    placeholder={props.placeholder}
                    required={props.required}
                    rows={props.rows || 3}
                    {...field}
                />
            </FormControl>
        );
    }

    if (isSwitchInput(props)) {
        return (
            <div className='flex items-center space-x-2'>
                <Switch
                    checked={field.value as boolean}
                    disabled={props.disabled}
                    id={props.name as string}
                    onCheckedChange={field.onChange}
                    required={props.required}
                />
                <div className='grid gap-1.5'>
                    <Label
                        className='cursor-pointer font-medium text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        htmlFor={props.name as string}
                    >
                        {props.label}
                    </Label>
                    {props.description && <p className='text-muted-foreground text-sm'>{props.description}</p>}
                </div>
            </div>
        );
    }

    return null;
};

// Main component
export const CustomInput = <T extends FieldValues>(props: InputProps<T>) => {
    const { name, label, control, type } = props;

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='w-full'>
                    {/* Don't show label for checkbox/switch since they render it themselves */}
                    {type !== 'checkbox' && type !== 'switch' && type !== 'radio' && (
                        <FormLabel>
                            {label}
                            {props.required && <span className='ml-1 text-destructive'>*</span>}
                        </FormLabel>
                    )}
                    <RenderInput
                        field={field}
                        props={props}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

// Type for working days
export type Day = {
    day: string;
    startTime?: string;
    endTime?: string;
};

// Switch input component for working schedule
interface WorkScheduleProps {
    days: { label: string; value: string }[];
    schedule: Day[];
    onScheduleChange: (schedule: Day[]) => void;
    disabled?: boolean;
}

export const WorkScheduleInput = ({ days, schedule, onScheduleChange, disabled = false }: WorkScheduleProps) => {
    const handleDayToggle = (day: string, enabled: boolean) => {
        if (enabled) {
            // Add day with default times
            const newDay: Day = {
                day,
                startTime: '09:00',
                endTime: '17:00'
            };
            onScheduleChange([...schedule.filter(d => d.day !== day), newDay]);
        } else {
            // Remove day
            onScheduleChange(schedule.filter(d => d.day !== day));
        }
    };

    const handleTimeChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
        const updatedSchedule = schedule.map(d => (d.day === day ? { ...d, [field]: value } : d));
        onScheduleChange(updatedSchedule);
    };

    const isDayEnabled = (dayValue: string) => {
        return schedule.some(d => d.day === dayValue);
    };

    const getDaySchedule = (dayValue: string): Day | undefined => {
        return schedule.find(d => d.day === dayValue);
    };

    return (
        <div className='space-y-3'>
            {days.map(day => {
                const dayEnabled = isDayEnabled(day.value);
                const daySchedule = getDaySchedule(day.value);

                return (
                    <div
                        className='flex w-full items-center space-y-3 border-t border-t-gray-200 py-3'
                        key={day.value}
                    >
                        <Switch
                            checked={dayEnabled}
                            className='peer data-[state=checked]:bg-blue-600'
                            disabled={disabled}
                            id={`day-${day.value}`}
                            onCheckedChange={checked => handleDayToggle(day.value, checked as boolean)}
                        />
                        <Label
                            className='w-20 capitalize'
                            htmlFor={`day-${day.value}`}
                        >
                            {day.label}
                        </Label>

                        {!dayEnabled ? (
                            <Label className='pl-10 font-normal text-gray-400 italic'>Not working on this day</Label>
                        ) : (
                            <div className='flex items-center gap-2 pl-6'>
                                <Input
                                    className='w-32'
                                    disabled={disabled}
                                    onChange={e => handleTimeChange(day.value, 'startTime', e.target.value)}
                                    type='time'
                                    value={daySchedule?.startTime || '09:00'}
                                />
                                <span className='text-gray-400'>to</span>
                                <Input
                                    className='w-32'
                                    disabled={disabled}
                                    onChange={e => handleTimeChange(day.value, 'endTime', e.target.value)}
                                    type='time'
                                    value={daySchedule?.endTime || '17:00'}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// Usage examples
/*

// Example with a patient form
interface PatientFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE';
  bloodGroup?: string;
  allergies?: string;
  medicalHistory?: string;
  isActive: boolean;
}

// Usage in a form component
export function PatientForm() {
  const { control, handleSubmit } = useForm<PatientFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: new Date(),
      gender: 'MALE',
      isActive: true,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomInput<PatientFormData>
        control={control}
        name="firstName"
        type="input"
        label="First Name"
        placeholder="Enter first name"
        required
      />
      
      <CustomInput<PatientFormData>
        control={control}
        name="email"
        type="input"
        label="Email"
        placeholder="patient@example.com"
        inputType="email"
      />
      
      <CustomInput<PatientFormData>
        control={control}
        name="gender"
        type="select"
        label="Gender"
        selectList={[
          { label: 'Male', value: 'MALE' },
          { label: 'Female', value: 'FEMALE' }
        ]}
      />
      
      <CustomInput<PatientFormData>
        control={control}
        name="isActive"
        type="switch"
        label="Active Patient"
        description="Patient is currently active"
      />
      
      <CustomInput<PatientFormData>
        control={control}
        name="allergies"
        type="textarea"
        label="Allergies"
        placeholder="List any allergies..."
        rows={4}
      />
    </form>
  );
}

// Example with work schedule
export function DoctorScheduleForm() {
  const [workSchedule, setWorkSchedule] = useState<Day[]>([]);
  
  const daysOfWeek = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' },
  ];

  return (
    <div>
      <h3>Working Hours</h3>
      <WorkScheduleInput
        days={daysOfWeek}
        schedule={workSchedule}
        onScheduleChange={setWorkSchedule}
      />
    </div>
  );
}

*/
