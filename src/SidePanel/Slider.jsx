import React from 'react';
import { func, number } from 'prop-types';
import { useDispatch } from 'react-redux';
import Rangeslider from 'react-rangeslider';

const Slider = ({
    value,
    min,
    max,
    onChange,
    onChangeComplete,
}) => {
    const dispatch = useDispatch();

    return (
        <Rangeslider
            value={value}
            min={min}
            max={max}
            onChange={newValue => dispatch(onChange(newValue))}
            onChangeComplete={onChangeComplete && (() => onChangeComplete(value))}
            labels={{
                [min]: min,
                [value]: value,
                [max]: max,
            }}
            tooltip={false}
        />
    );
};
Slider.propTypes = {
    value: number.isRequired,
    min: number.isRequired,
    max: number.isRequired,
    onChange: func.isRequired,
    onChangeComplete: func, // eslint-disable-line react/require-default-props
};

export default Slider;
