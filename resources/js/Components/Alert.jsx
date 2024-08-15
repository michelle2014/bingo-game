import React from 'react';
import { useState } from 'react';
import { Button, AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, useDisclosure } from '@chakra-ui/react'

function Alert(props) {
  const [isGenerated, setIsGenerated] = useState(props.isGenerated);
  const [markedCards, setMarkedCards] = useState(props.markedCards);
  const { isOpen, onClose, onOpen } = useDisclosure()
  const cancelRef = React.useRef()

  return (
    <>
      <Button onClick={onOpen} colorScheme='blue'>Generate</Button>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to regenerate cards.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button onClick={() => { props.toggleGenerated(); } } colorScheme='red' ml={3}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Alert
