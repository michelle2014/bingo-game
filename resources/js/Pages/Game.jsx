import { Text, Box, Container, Button, FormControl, FormErrorMessage, FormLabel, Input, Grid, GridItem, VStack, AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, useDisclosure } from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import React from 'react';
import Share from '../Components/Share';
import { Inertia } from '@inertiajs/inertia';

function Game() {
  // const [isSubmitted, setIsSubmitted] = useState();
  const [isSubmitted, setIsSubmitted] = useState(() => {
    return JSON.parse(localStorage.getItem('isSubmitted') || 'false');
  });

  useEffect(() => {
    localStorage.setItem('isSubmitted', JSON.stringify(isSubmitted));
  }, [isSubmitted]);

  // const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerated, setIsGenerated] = useState(() => {
    return JSON.parse(localStorage.getItem('isGenerated') || 'false');
  });

    useEffect(() => {
    localStorage.setItem('isGenerated', JSON.stringify(isGenerated));
  }, [isGenerated]);

  const [markedButtons, setMarkedButtons] = useState([]);
  // const [markedButtons, setMarkedButtons] = useState(() => {
  //   return JSON.parse(localStorage.getItem('markedButtons') || []);
  // });

  //   useEffect(() => {
  //   localStorage.setItem('markedButtons', JSON.stringify(markedButtons));
  // }, [markedButtons]);

  const [cards, setCards] = useState([]);
  console.log(cards);
  // const [cards, setCards] = useState(() => {
  //   return JSON.parse(localStorage.getItem('cards') || [])
  // });

  // useEffect(() => {
  //   localStorage.setItem('cards', JSON.stringify(cards));
  // }, [cards]);

  function validateName(value) {
    let error
    if (!value) {
      error = 'Name is required'
    } return error
  }

  async function handleSubmit(values) {
    try {
      const response = await fetch('/submit-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') // Ensure CSRF token is included
        },
        body: JSON.stringify(values)
      });
      // console.log(values);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      alert('Data submitted successfully: ' + JSON.stringify(data, null, 2));

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    }
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
    setMarkedButtons([]);
  }

  function handleMark(index, event) {
    event.preventDefault();
    fetch('/game', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({ markedCard: index })
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('marked-card').innerText = 'Marked Card: ' + index;
    })
      .catch(error => console.error('Error:', error));
    setMarkedButtons((prevMarkedButtons) => {
      // Toggle the button state
      if (prevMarkedButtons.includes(index)) {
        return prevMarkedButtons.filter((i) => i !== index);
      } else {
        return [...prevMarkedButtons, index];
      }
    });
  }

  function Alert() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    function handleGenerateWithMarked() {
      setIsGenerated(!isGenerated);
      setMarkedButtons([]);
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
            onSubmit={() => handleSubmit()}
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
                        <form action='mark' method='post'>
                          <Button onClick={(e) => { handleMark(index, e) }} color={markedButtons.includes(index) ? 'gray' : 'tomato'} border='0px' variant='ghost' fontSize='20px'>{index}</Button>
                        </form>
                      </GridItem>
                    )}
                    <GridItem w='100%' h='10' bg='white' color='tomato'>
                      <Button color='tomato' border='0px' variant='ghost' fontSize='10px'>FREE</Button>
                    </GridItem>
                    {cards.slice(12,24).map((index) =>
                      <GridItem key={index} w='100%' h='10' bg='white' >
                        <form action='mark' method='post'>
                          <Button onClick={(e) => { handleMark(index, e) }} color={markedButtons.includes(index) ? 'gray' : 'tomato'} border='0px' variant='ghost' fontSize='20px'>{index}</Button>
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
            {markedButtons.length !== 0 ? <Alert />
              : <Button onClick={() => handleGenerate()} colorScheme='blue'>Generate</Button>
            }
            <Share />
          </VStack>
        }
      </VStack>
      <VStack paddingTop={10}>
        <form action='call' method='post'>
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
