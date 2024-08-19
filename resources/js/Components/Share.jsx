import { Link, Text } from '@chakra-ui/react'

function Share() {

    return (
      <>
        <Text>
          Share with the caller {' '}
          <Link color='teal.500' href='https://r5mky6llglv2yvbtrrnkcae3dq0yvdjt.lambda-url.ap-southeast-2.on.aws/game'>
            the current layout and marking
          </Link>
        </Text>
      </>
    )
}

export default Share
