import { TableContainer, Table, TableCaption, Thead, Tbody, Tr, Th, Td, Box, Container, Heading, Center } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import React from 'react';

function Leaderboard({ games }) {

  return (
    <Container maxW='md' bg='white' color='white'>
      <Box paddingTop='14' color='black' maxW='md'>
        <Center bg='white' h='100px' color='tomato'>
          <Heading mb={4} as='h1' size='md'>Bingo Game Leaderboard</Heading>
          </Center>
          <TableContainer>
            <Table variant='striped' colorScheme='teal' >
              <TableCaption>Bingo Game Leaderboard</TableCaption>
              <Thead>
                <Tr>
                  <Th>name</Th>
                  <Th isNumeric>score</Th>
                </Tr>
              </Thead>
            <Tbody>
              {games.map((game) => (
                <Tr key={game.id}>
                  <Td>{game.name}</Td>
                  <Td isNumeric>{game.score}</Td>
                </Tr>
              ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
  )
}

export default Leaderboard
