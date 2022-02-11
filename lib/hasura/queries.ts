import gql from "graphql-tag";

const getTests = gql`
      query GetTests {
          test {
            id
            name
          }
        }
        `

export {
    getTests
}