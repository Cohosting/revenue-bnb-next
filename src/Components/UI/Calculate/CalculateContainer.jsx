import React, { useContext, useEffect, useRef } from 'react';
import { useDisclosure, useMediaQuery, useOutsideClick } from '@chakra-ui/react';
import DesktopSearch from './DesktopSearch';
import MobileSearch from './../../MobileSearch';
import stateProvider from '../../../context/stateProvider';
import { useInput } from '../../PropertyDetails/PropertyDetails';


let labelStyle = {
    fontSize: "14px",
    fontFamily: "GTBold",
};

const CalculateContainer = (props) => {
    const [isLessThan680] = useMediaQuery("(max-width: 680px)");
    const { counts, setCounts, location, setPropertyCoordinates, setIsSelectedFromDropdown,

        setDropdownLocationError, } =
        useContext(stateProvider);
    const { bathrooms, bedrooms, guests } = counts;

    const address = useInput();


    const ref = useRef();
    const outsideRef = useRef();
    useOutsideClick({
        /* @ts-ignore */
        ref: outsideRef,
        handler: () => address.setShow(false),
    });
    const addItem = (text) => {
        const textLower = text.toLowerCase();

        if (text === "Bathrooms") {
            setCounts({
                ...counts,
                [textLower]: counts[textLower] + 0.5,
            });
        } else {
            setCounts({
                ...counts,
                [textLower]: parseInt(counts[textLower]) + 1,
            });
        }
    };
    const removeItem = (text) => {
        const textLower = text.toLowerCase();
        if (counts[textLower] === 1) return;

        if (text === "Bathrooms") {
            setCounts({
                ...counts,
                [textLower]: counts[textLower] - 0.5,
            });
        } else {
            setCounts({
                ...counts,
                [textLower]: parseInt(counts[textLower]) - 1,
            });
        }
    };

    useEffect(() => {
        address.setShow(false);
    }, [location]);

    const mergedProps = {
        ...props,
        addItem,
        removeItem,
        ref,
        labelStyle,
        bathrooms, bedrooms, guests,
        outsideRef, counts, setPropertyCoordinates, address, setIsSelectedFromDropdown,
        setDropdownLocationError,
    }
    return (
        <>
            {isLessThan680 ? (
                <MobileSearch {...mergedProps} />
            ) : (
                <DesktopSearch {...mergedProps} />
            )}
        </>
    );
};

export default CalculateContainer;