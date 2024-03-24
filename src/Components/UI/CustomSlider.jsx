import { Box, Image, Text } from '@chakra-ui/react';
import React from 'react';
import Slider from 'react-slick';

export const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                display: "block",
                boxShadow: " 0px 3px 3px 0px rgba(158, 157, 164, 0.3)",
            }}
            onClick={onClick}
        >
            sdfsdf
        </div>
    );
};
function isEven(n) {
    return n % 2 == 0;
}

export const CustomSlider = ({ settings, data, setLocation, setPropertyCoordinates, isLessThan680 }) => {

    return (
        <Slider {...settings}>
            {data.map((el, idx) => (
                <Box
                    key={idx}
                    style={{
                        width: !isLessThan680 ? "150px" : "130px",
                    }}
                >
                    <Box
                        onClick={() => {
                            setLocation(el.text);
                            setPropertyCoordinates(el.coordinates);
                        }}
                        cursor={"pointer"}
                        mx={"10px"}
                        pt={isEven(idx) && "50px"}
                    >
                        <Image
                            src={el.imageUrl}
                            alt="Description"
                            borderRadius={"12px"}
                            w={"250px"}
                            height={"170px"}
                            objectFit="cover"
                        />
                        <Text
                            textAlign={"center"}
                            mt={2}
                            fontFamily={"GTMedium"}
                            fontSize={"12px"}
                            fontWeight={"500"}
                        >
                            {" "}
                            Search location
                        </Text>
                        <Text
                            fontFamily={"GTBold"}
                            textAlign="center"
                            fontSize={["12px", "14px"]}
                        >
                            {" "}
                            {el.text}{" "}
                        </Text>
                    </Box>
                </Box>
            ))}
        </Slider>
    );
};

