import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import React from 'react'

export const LocationErrorModal = ({
    isLocationError,
    onLocationErrorClose


}) => {
    return (
        <Modal
            isCentered
            isOpen={isLocationError}
            onClose={onLocationErrorClose}
        >
            <ModalOverlay />
            <ModalContent fontFamily={"GTMedium"}>
                <ModalHeader color={"red"}>Location Error</ModalHeader>
                <ModalBody>
                    <Text>
                        Having trouble getting your location. Please input your
                        location. Thank you.
                    </Text>
                </ModalBody>

                <ModalFooter>
                    <Button
                        bg={"rgb(247, 34, 219)"}
                        w={"100%"}
                        colorScheme="blue"
                        mr={3}
                        onClick={onLocationErrorClose}
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

