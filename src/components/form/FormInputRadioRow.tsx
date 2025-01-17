import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { FormControlLabel, InputLabel, Radio, RadioGroup } from '@mui/material'
import Typography from '@mui/material/Typography'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import React from 'react'
import { Variant } from '@mui/material/styles/createTypography'

type FormInputRadioRowProps<T extends FieldValues> = {
  id: string
  name: Path<T>
  control: Control<T, object>
  label: string
  size?: 'small' | 'medium'
  options: any[]
  rules?: RegisterOptions
  disabled?: boolean
  labelVariant?: Variant
}

export const FormInputRadioRow = <T extends FieldValues>({
  id,
  name,
  control,
  label,
  options,
  rules,
  disabled,
  labelVariant = 'subtitle2',
}: FormInputRadioRowProps<T>) => (
  <div>
    <InputLabel htmlFor={id}>
      <Typography
        variant={labelVariant}
        sx={{ color: 'text.primary', fontWeight: '500' }}
      >
        {label}
      </Typography>
    </InputLabel>
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <RadioGroup row value={value} onChange={onChange} id={id} name={name}>
          {options.map((singleOption, index) => (
            <FormControlLabel
              key={index}
              disabled={disabled}
              value={singleOption.value}
              label={singleOption.label}
              control={<Radio />}
            />
          ))}
        </RadioGroup>
      )}
      rules={rules}
    />
  </div>
)
