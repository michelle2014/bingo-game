import { Link, Text } from '@chakra-ui/react'

function Share() {

    return (
      <>
        <Text>
          Share with the caller {' '}
          <Link color='teal.500' href='http://localhost:8000/game'>
            the current layout and marking
          </Link>
        </Text>
      </>
    )
}

export default Share
