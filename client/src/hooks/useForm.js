import { useState, useCallback } from 'react';

export const useForm = (initialValues, onSubmitHandler, options = {}) => {
    const [values, setValues] = useState(initialValues);
    const { onChangeCallback } = options || {};

    const onChange = (e) => {
        const { name, value } = e.target;
        
        setValues(state => ({
            ...state,
            [name]: value
        }));
        
        if (onChangeCallback && typeof onChangeCallback === 'function') {
            onChangeCallback(name, value);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (onSubmitHandler) {
            onSubmitHandler(values);
        }
    };

    const onBlur = (e) => {
        const { name, value } = e.target;
        
        if (options?.onBlurCallback && typeof options.onBlurCallback === 'function') {
            options.onBlurCallback(name, value);
        }
    };

    const changeValues = (newValues) => {
        setValues(newValues);
    };

    return {
        values,
        onChange,
        onSubmit,
        onBlur,
        changeValues,
    };
};
