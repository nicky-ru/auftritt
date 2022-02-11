import {Container, Spinner, Text} from "@chakra-ui/react";
import {useQuery} from "@apollo/client";
import {getTests} from "../lib/hasura/queries";

export const Test = () => {
    // @ts-ignore
    const { loading, error, data } = useQuery(getTests);

    return(
        <Container>
            {loading&&<Spinner/>}
            {data?.test.map((test: {id: number, name: string}) => (
                <Text key={test.id}>
                    {test.name}
                </Text>
            ))}
        </Container>
    )
}