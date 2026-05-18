"use client"

import React, { useState, useRef, useEffect } from "react"

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  error?: string
  halved?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, name, type = "text", required, value, defaultValue, onChange, ...props }, ref) => {


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
    }

    return (
      <div className="input_wrapper">
          <label htmlFor={name} className="input_label">{label}</label>
          <input id={name} name={name} type={type} className="input" onChange={handleChange} value={value} defaultValue={defaultValue} {...props} />
      </div>
    )
  },
)


export { CustomInput }
