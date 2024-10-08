import { Link, Text, Box, Container, Button, FormControl, FormErrorMessage, FormLabel, Input, Grid, GridItem, VStack, useDisclosure } from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import React from 'react';
import Share from '../Components/Share';
import Alert from '../Components/Alert';

function Game() {

  const [isSubmitted, setIsSubmitted] = useState(() => {
    const saved = localStorage.getItem('isSubmitted');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [isGenerated, setIsGenerated] = useState(() => {
    const saved = localStorage.getItem('isGenerated');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [markedCards, setMarkedCards] = useState(() => {
    const saved = localStorage.getItem('markedCards');
    return saved !== null ? JSON.parse(saved) : [];
  });

  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('cards');
    return saved !== null ? JSON.parse(saved) : [];
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

  function toggleGenerated() {
    setIsGenerated(prev => !prev);
    setMarkedCards([]);
  }

  function validateName(value) {
    let error
    if (!value) {
      error = 'Name is required'
    } return error
  }

  function handleSubmit(values) {
    fetch('/name', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({ name: values.name })
    })
      .then(response => {
      if (!response.ok) {
        // If response status is not OK, throw an error
        throw new Error('Network response was not ok');
      }
      return response.text(); // Get the response body as text
    })
    .then(text => {
      if (text) {
        // Attempt to parse the response text as JSON
        try {
          return JSON.parse(text);
        } catch (e) {
          throw new Error('Failed to parse JSON');
        }
      } else {
        // Handle empty response case
        return {};
      }
    })
    .then(data => {
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

  function handleMark(card, event) {
    event.preventDefault();
    setMarkedCards((prevMarkedCards) => {
      // Toggle the button state
      if (prevMarkedCards.includes(card)) {
        return prevMarkedCards;
      } else {
        return [...prevMarkedCards, card];
      }
    });

  }

  useEffect(() => {
    fetch('/game', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({ markedCards: markedCards })
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('marked-card').innerText = 'Marked Card: ' + markedCards[markedCards.length - 1];
    })
      .catch(error => console.error('Error:', error));
  }, [markedCards]);

  let buttonPresses = 0;

  function fetchRandomNumber() {
    buttonPresses++;
    fetch('/rand', {
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
        document.getElementById('button-presses').innerText = 'Button Presses: ' + data.buttonPresses;
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
                    {cards.slice(0,12).map((card) =>
                      <GridItem key={card} w='100%' h='10' bg='white' >
                        <form action='' method='post'>
                          <Button onClick={(e) => { handleMark(card, e) }} color={markedCards.includes(card) ? 'gray' : 'tomato'} border='0px' variant='ghost' fontSize='20px'>{card}</Button>
                        </form>
                      </GridItem>
                    )}
                    <GridItem w='100%' h='10' bg='white' color='tomato'>
                      <Button color='tomato' border='0px' variant='ghost' fontSize='10px'>FREE</Button>
                    </GridItem>
                    {cards.slice(12,24).map((card) =>
                      <GridItem key={card} w='100%' h='10' bg='white' >
                        <form action='' method='post'>
                          <Button onClick={(e) => { handleMark(card, e) }} color={markedCards.includes(card) ? 'gray' : 'tomato'} border='0px' variant='ghost' fontSize='20px'>{card}</Button>
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
            {markedCards.length !== 0 ? <Alert isGenerated={ isGenerated } markedCards={markedCards} toggleGenerated={toggleGenerated}/>
              : <Button onClick={() => handleGenerate()} colorScheme='blue'>Generate</Button>
            }
            <Share />
          </VStack>
        }
      </VStack>
      {isSubmitted &&
        <>
        <VStack paddingTop={10}>
          <form action='' method='post'>
            <Button onClick={() => fetchRandomNumber()} colorScheme='yellow'>Call next number</Button>
          </form>
          <Text id='random-number'></Text>
          <Text id='marked-card'></Text>
          <Text id='button-presses'></Text>
        </VStack>
        <VStack paddingTop={10}>
          <Link color='teal.500' href='/leaderboard'>
            Check the leaderboard
          </Link>
        </VStack></>
      }
    </>
  )
}

export default Game
