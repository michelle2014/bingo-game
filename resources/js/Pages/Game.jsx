import { Text, Box, Container, Button, FormControl, FormErrorMessage, FormLabel, Input, Grid, GridItem, VStack, AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, useDisclosure } from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import React from 'react';
import Share from '../Components/Share';
import { Inertia } from '@inertiajs/inertia';

function Game() {

  const [isSubmitted, setIsSubmitted] = useState(() => {
    const saved = localStorage.getItem('isSubmitted');
    return saved !== null ? JSON.parse(saved) : false; // Default to false if null
  });

  const [isGenerated, setIsGenerated] = useState(() => {
    const saved = localStorage.getItem('isGenerated');
    return saved !== null ? JSON.parse(saved) : false; // Default to false if null
  });

  const [markedCards, setMarkedCards] = useState(() => {
    const saved = localStorage.getItem('markedCards');
    return saved !== null ? JSON.parse(saved) : []; // Default to empty array if null
  });

  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('cards');
    return saved !== null ? JSON.parse(saved) : []; // Default to empty array if null
  });

  useEffect(() => {
    localStorage.setItem('isSubmitted', JSON.stringify(isSubmitted));
  }, [isSubmitted]);

  useEffect(() => {
    localStorage.setItem('isGenerated', JSON.stringify(isGenerated));
  }, [isGenerated]);

  useEffect(() => {
    localStorage.setItem('markedCards', JSON.stringify(markedCards));
  }, [markedCards]);

  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  function validateName(value) {
    let error
    if (!value) {
      error = 'Name is required'
    } return error
  }

  function handleSubmit(name) {
    fetch('/game', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify(name)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
    })
      .catch(error => console.error('Error:', error));
    setIsSubmitted(true);
  }

  function handleGenerate() {
    let newCards = [];

    while(newCards.length < 24){
      let r = Math.floor(Math.random() * 100) + 1;
      if(newCards.indexOf(r) === -1) newCards.push(r);
    }
    setCards(newCards);
    setIsGenerated(!isGenerated);
    setMarkedCards([]);
  }

  function handleMark(index, event) {
    event.preventDefault();
    setMarkedCards((prevMarkedCards) => {
      // Toggle the button state
      if (prevMarkedCards.includes(index)) {
        return prevMarkedCards.filter((i) => i !== index);
      } else {
        return [...prevMarkedCards, index];
      }
    });
    console.log(markedCards);

    fetch('/game', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({ markedCards: markedCards})
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('marked-card').innerText = 'Marked Card: ' + index;
    })
      .catch(error => console.error('Error:', error));
  }

  function Alert() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    function handleGenerateWithMarked() {
      setIsGenerated(!isGenerated);
      setMarkedCards([]);
    }
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
              <Button onClick={() => handleGenerateWithMarked()} colorScheme='red' ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  let pressCount = 0;

  let buttonPresses = 0;

  function fetchRandomNumber() {
    buttonPresses++;
    fetch('/game', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({ buttonPresses: buttonPresses })
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('random-number').innerText = 'Random Number: ' + data.number;

        // Increment and display the press count
        pressCount++;
        document.getElementById('press-count').innerText = `Number of call button presses: ${pressCount}`;
    })
      .catch(error => console.error('Error:', error));
    }

  return (
    <>
      <VStack
        paddingTop={14}
        spacing={4}
        align='center'
      >
        <Formik
            initialValues={{ name: '' }}
            onSubmit={(name) => handleSubmit(name)}
        >
          {() => (
            <Form method='post'>
              <Field id='name' name='name' validate={validateName}>
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.name && form.touched.name}>
                    <FormLabel>Please enter your name</FormLabel>
                      <Input {...field} placeholder='name' />
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                mt={4}
                colorScheme='teal'
                type='submit'
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
        {isSubmitted &&
          <VStack
            spacing={4}
            align='stretch'
          >
            <Container maxW='md' bg='tomato' color='white'>
              <Box padding='4' color='tomato' maxW='md'>
                <Grid templateColumns='repeat(5, 1fr)' gap={2}>
                  <GridItem fontSize='30px' w='100%' h='10' bg='tomato' color='white'>B</GridItem>
                  <GridItem fontSize='30px' w='100%' h='10' bg='tomato' color='white'>I</GridItem>
                  <GridItem fontSize='30px' w='100%' h='10' bg='tomato' color='white'>N</GridItem>
                  <GridItem fontSize='30px' w='100%' h='10' bg='tomato' color='white'>G</GridItem>
                  <GridItem fontSize='30px' w='100%' h='10' bg='tomato' color='white'>O</GridItem>
                </Grid>
                {isGenerated && cards.length > 0 ?
                  <Grid templateColumns='repeat(5, 1fr)' gap={1}>
                    {cards.slice(0,12).map((index) =>
                      <GridItem key={index} w='100%' h='10' bg='white' >
                        <form action='' method='post'>
                          <Button onClick={(e) => { handleMark(index, e) }} color={markedCards.includes(index) ? 'gray' : 'tomato'} border='0px' variant='ghost' fontSize='20px'>{index}</Button>
                        </form>
                      </GridItem>
                    )}
                    <GridItem w='100%' h='10' bg='white' color='tomato'>
                      <Button color='tomato' border='0px' variant='ghost' fontSize='10px'>FREE</Button>
                    </GridItem>
                    {cards.slice(12,24).map((index) =>
                      <GridItem key={index} w='100%' h='10' bg='white' >
                        <form action='' method='post'>
                          <Button onClick={(e) => { handleMark(index, e) }} color={markedCards.includes(index) ? 'gray' : 'tomato'} border='0px' variant='ghost' fontSize='20px'>{index}</Button>
                        </form>
                      </GridItem>
                    )}
                  </Grid>
                  : <Grid templateColumns='repeat(5, 1fr)' gap={1}>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' color='tomato'>
                      <Button color='tomato' border='0px' variant='ghost' fontSize='10px'>FREE</Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='white' >
                        <Button color='tomato' border='0px' variant='ghost' fontSize='20px'></Button>
                    </GridItem>
                  </Grid>
                }
              </Box>
            </Container>
            {markedCards.length !== 0 ? <Alert />
              : <Button onClick={() => handleGenerate()} colorScheme='blue'>Generate</Button>
            }
            <Share />
          </VStack>
        }
      </VStack>
      <VStack paddingTop={10}>
        <form action='' method='post'>
          <Button onClick={() => fetchRandomNumber()} colorScheme='yellow'>Call next number</Button>
        </form>
        <Text id='random-number'></Text>
        <Text id='press-count'></Text>
        <Text id='marked-card'></Text>
      </VStack>
    </>
  )
}

export default Game
