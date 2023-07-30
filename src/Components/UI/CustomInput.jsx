import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import React, { useContext } from 'react';
import stateProvider from '../../context/stateProvider';


const CustomInput = ({
    value,
    handleChange,
    icon,
    sx,
    ...otherProps
}) => {

    const { step } = useContext(stateProvider
    )
    let inputStyle = {
        fontFamily: 'GTMedium',
        borderRadius: '24px',
        border: '2px solid #E2E8F0',
        height: '3.125rem',
        color: 'rgb(80,80,81)',
        transition: 'all 250ms ease 0s',
        _placeholder: {
            color: 'rgb(80,80,81)',
        },
        _hover: { border: '2px solid rgb(163, 223, 230)' },
        _focus: {},
        _active: {},
        ...sx
    };

    return (
        <InputGroup marginBottom={'10px'} mt={step === 3 ? '40px' : ''} mb={step === 3 ? '45px' : ''}>
            {icon && (
                <InputLeftElement width='4.5rem' pr='25px' children={icon} h='100%' />
            )}

            <Input
                value={value}
                sx={{
                    ...inputStyle,
                }}
                onChange={handleChange}
                pr='4.5rem'
                {...otherProps}
            />
        </InputGroup>
    );
};
export default CustomInput;
